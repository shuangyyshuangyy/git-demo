import { FolderService } from '@/services/folder.service';
import { validWatchfacePath } from '@/utils/watchface-valid.utils';
import { ref, watch } from 'vue';

interface WatchfaceStorageItem {
  path: string;
  // 是否为当前打开的状态 false为未打开，其他都为打开状态
  active?: boolean;
  // 是否在tab中显示
  tab?: boolean;
  // 上次打开的时间戳
  lastOpend?: number;
  // 是否为收藏态
  collect?: boolean;
}

export class WatchfaceStorage {
  static key = '_history';
  static data = ref<WatchfaceStorageItem[] | undefined>();

  private static resetStorage() {
    // 重新设置storage
    try {
      window.localStorage.setItem(
        WatchfaceStorage.key,
        JSON.stringify(WatchfaceStorage.data.value)
      );
    } catch (error) {
      console.log(error);
    }
    // console.log(WatchfaceStorage.data.value);
  }

  static async init() {
    //window.localStorage.removeItem('_history');
    const key = WatchfaceStorage.key;
    let items: WatchfaceStorageItem[] = [];
    try {
      const str = window.localStorage.getItem(key);
      if (str) items = JSON.parse(str);
    } catch (error) {
      console.log(error);
    }

    WatchfaceStorage.data.value = items;

    // 验证path是否合法
    for (let i = 0; i < items.length; i++) {
      const { path } = items[i];
      const valid = await validWatchfacePath(path);
      if (!valid) {
        WatchfaceStorage.deleteItem(path);
      }
    }
  }

  /**
   * 新增表盘
   */
  static addItem({
    path,
    active,
    tab = true,
    collect = false
  }: {
    path: string;
    active?: WatchfaceStorageItem['active'];
    tab?: boolean;
    collect?: boolean;
  }) {
    const items = WatchfaceStorage.data.value ?? [];
    // 如果不存在
    let item = items.find((_item) => _item.path == path);
    if (!item) {
      item = {
        path
      };
      items.push(item);
    }
    // active为互斥的，如果需要设置为true，需要将其他的设置为false
    if (active) {
      items.forEach((item) => (item.active = false));
    }
    // 如果当前没有在tabs中，则需要更新打开时间
    if (!item.tab) item.lastOpend = Date.now();
    item.active = !!active;
    item.tab = !!tab;
    item.collect = !!collect;

    // 重新设置storage
    WatchfaceStorage.resetStorage();
    // console.log(item, WatchfaceStorage.data.value);
  }

  static deleteItem(path: string) {
    const items = WatchfaceStorage.data.value ?? [];
    const index = items.findIndex((item) => item.path == path);
    items.splice(index, 1);

    // 重新设置storage
    WatchfaceStorage.resetStorage();
  }

  static updateItem(
    path: string,
    {
      tab,
      active,
      collect
    }: { tab?: boolean; active?: boolean; collect?: boolean }
  ) {
    const items = WatchfaceStorage.data.value ?? [];
    const item = items.find((item) => item.path == path);
    if (!item) return;
    if (tab !== undefined) item.tab = !!tab;
    if (collect !== undefined) item.collect = !!collect;
    if (active !== undefined) {
      if (active) {
        items.forEach((item) => (item.active = false));
      }
      item.active = !!active;
    }
    // 重新设置storage
    WatchfaceStorage.resetStorage();
  }

  /**
   * 清空所有的active状态
   */
  static clearActive() {
    WatchfaceStorage.data.value?.forEach((item) => (item.active = false));
    // 重新设置storage
    WatchfaceStorage.resetStorage();
  }
}
// 自动加载localstorage数据
if (WatchfaceStorage.data.value == undefined) {
  WatchfaceStorage.init();
}

export interface HistoryWatchfaceItem extends WatchfaceStorageItem {
  title?: string;
  size?: string;
  preview?: string;
  devciceType?: string;
}

const _watchfaceItems = ref<HistoryWatchfaceItem[]>([]);
export const useWatchfaceHistory = () => {
  const updateItems = async () => {
    const items: HistoryWatchfaceItem[] = [];
    const storageItems = WatchfaceStorage.data.value ?? [];

    for (let i = 0; i < storageItems.length; i++) {
      const item = storageItems[i];

      const service = new FolderService(item.path);
      const itemTitle = await service.getDescriptionData().then((r) => r?.name);
      const title = String(itemTitle);
      const size = await service.getDescriptionData().then((r) => r?.size);
      const devciceType = await service
        .getDescriptionData()
        .then((r) => r?.deviceType);
      const preview = '';

      items.push({
        ...item,
        size,
        title,
        devciceType,
        preview
      });
    }
    _watchfaceItems.value = items;
  };

  watch(() => WatchfaceStorage.data, updateItems, {
    immediate: true,
    deep: true
  });

  return {
    clearActive: WatchfaceStorage.clearActive,
    storageData: WatchfaceStorage.data,
    historyData: _watchfaceItems,
    deleteFromStorage: WatchfaceStorage.deleteItem,
    removeFromTabs: (path: string) => {
      WatchfaceStorage.updateItem(path, { tab: false, active: false });
    },
    addItem: WatchfaceStorage.addItem,
    updateItem: WatchfaceStorage.updateItem,
    updateItems
  };
};
