import { useImagesStore } from '@/store/use-images-store';
import { useLayerStore } from '@/store/use-layer-store';
import { computed, ref } from 'vue';
import { openDB } from 'idb';
import { textToMd5 } from '@/utils/md5.utils';
import { useWatchfaceStore } from '@/store/use-watchface-store';
import { ResourceItem } from '@/services/folder.service';
import { debounce } from 'lodash-es';
import { emitter } from '@/utils/emitter.utils';
import { EventType } from '@/utils/emitter.utils';
import { useSelectStore } from '@/store/use-select-store';

type IndexedDBKey = string;

interface Snapshot {
  layer: IndexedDBKey;
  images: { basename: string; realpath: string; value: IndexedDBKey }[];
}

/**
 * 不同表盘对应的操作历史记录
 */
const historyMap = ref<
  Record<
    string,
    {
      index: number;
      max: number;
      min: 0;
    }
  >
>({});

export const useSnapshot = () => {
  const layerStore = useLayerStore();
  const imageStore = useImagesStore();
  const watchfaceStore = useWatchfaceStore();
  const selectStore = useSelectStore();

  const _STORE_NAME = 'snapshot-store';
  const _SNAPSHOT_KEY = 'snapshots';
  const _FILE_KEY = 'files';

  const _getDb = async () => {
    const db = await openDB(_STORE_NAME, 1, {
      upgrade(db) {
        // 保存snapshots
        db.createObjectStore(_SNAPSHOT_KEY);
        // 保存文件
        db.createObjectStore(_FILE_KEY);
      }
    });
    return db;
  };

  /**
   * 保存信息，并返回key值
   * @param value
   * @returns
   */
  const _saveFile = async (value: string) => {
    const db = await _getDb();
    const md5 = textToMd5(value);
    await db.put(_FILE_KEY, value, md5);
    return md5;
  };

  const _saveSnapshot = async (index: number | string, value: Snapshot) => {
    const db = await _getDb();
    await db.put(_SNAPSHOT_KEY, value, index);
  };

  const _getSnapshotKey = (index: number) => {
    const path = watchfaceStore.path;
    return path + ' index:' + index;
  };

  /**
   * 记录一个snapshot，返回对应的index
   */
  const record = async () => {
    const path = watchfaceStore.path;

    const _historyMap = historyMap.value;
    if (_historyMap[path] == undefined)
      _historyMap[path] = { index: -1, max: 0, min: 0 };

    try {
      // 将layer images等数据保存在indexedDB中
      // 保存layer数据
      const layer = layerStore.$state.themes;
      const layerKey = await _saveFile(JSON.stringify(layer));

      // save imgages
      const images: Snapshot['images'] = [];
      for (const img of imageStore.$state.imgs) {
        const { value, basename, realpath } = img;
        if (!value) continue;
        const key = await _saveFile(value.toString());
        images.push({ basename, value: key, realpath });
      }

      // save snapshot
      const snapshot: Snapshot = {
        layer: layerKey,
        images: images
      };

      // 新的index
      const index = ++_historyMap[path].index;
      _historyMap[path].max = index;

      const snapshotKey = _getSnapshotKey(index);
      await _saveSnapshot(snapshotKey, snapshot);
    } catch (error) {
      // 发生错误后，都重置为0，防止数据错乱
      _historyMap[path] = { index: 0, max: 0, min: 0 };
    }

    historyMap.value = _historyMap;
    return _historyMap;
  };

  /**
   * 获取当前表盘的操作数据
   */
  const history = computed(() => {
    const path = watchfaceStore.path;
    return historyMap.value[path];
  });

  /**
   * 清空当前表盘历史数据
   */
  const clear = async () => {
    const path = watchfaceStore.path;
    const items = historyMap.value;
    delete items[path];
    historyMap.value = items;

    try {
      const _db = await _getDb();
      const keys = await _db
        .getAllKeys(_SNAPSHOT_KEY)
        .then((keys) => keys.filter((key) => (key + '').includes(path)));

      for (const key of keys) {
        // 先清空files
        const snapshot: Snapshot = await _db.get(_SNAPSHOT_KEY, key);
        const _keys: string[] = [
          snapshot.layer,
          ...snapshot.images.map((item) => item.value)
        ];
        for (const _key of _keys) {
          await _db.delete(_FILE_KEY, _key);
        }

        // 然后清空snapshots
        await _db.delete(_SNAPSHOT_KEY, key);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _restoring = ref(false);
  /**
   * 将数据恢复到targetIndex，然后将当前的index设置为targetIndex
   * @param targetIndex
   */
  const _restore = async (targetIndex: number) => {
    const path = watchfaceStore.path;
    const _history = historyMap.value[path];
    // 没有历史数据，无法恢复
    if (!_history) return;
    // 目标index超过最大值，无法恢复
    if (_history.max < targetIndex) return;
    // 目标index小于最小值，无法恢复
    if (_history.min > targetIndex) return;
    // 无需回复
    if (targetIndex == _history.index) return;

    // 开始恢复数据
    if (_restoring.value) return;
    try {
      _restoring.value = true;
      // 获取保存的snapshot
      const _key = _getSnapshotKey(targetIndex);
      const _db = await _getDb();
      const snapshot: Snapshot = await _db.get(_SNAPSHOT_KEY, _key);

      // 获取layer
      const layerKey = snapshot.layer;
      const layerStrig = await _db.get(_FILE_KEY, layerKey);
      if (!layerStrig) throw 'ast文件损坏，无法恢复';
      const layers: StoreThemeItem[] = JSON.parse(layerStrig);

      // 获取资源数据
      const images: ResourceItem[] = [];
      for (const img of snapshot.images) {
        const _value = img.value;
        const value = await _db.get(_FILE_KEY, _value);
        if (!value) throw '资源文件损坏，无法恢复';
        images.push({ realpath: img.realpath, basename: img.basename, value });
      }

      layerStore.initStore(layers);
      imageStore.resetImages(images);
      // 同步index
      _history.index = targetIndex;
    } catch (error) {
      console.log(error);
    } finally {
      _restoring.value = false;
      emitter.emit(EventType['undo-redo']);
    }

    // 验证themeId
    const themeId = selectStore.themeId;
    if (!layerStore.normalThemes.some((item) => item.id == themeId)) {
      selectStore.selectTheme();
    }
  };

  // 撤销，返回上一步
  const undo = async () => {
    await _restore(history.value.index - 1);
  };

  // 恢复，回到下一步
  const redo = async () => {
    await _restore(history.value.index + 1);
  };

  return {
    record: debounce(record, 100),
    history: history,
    clear: clear,
    undo,
    redo
  };
};
