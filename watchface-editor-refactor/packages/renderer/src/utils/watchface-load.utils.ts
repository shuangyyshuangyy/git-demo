import { useWatchfaceStore } from '@/store/use-watchface-store';
import { ref } from 'vue';
import { emitter, EventType } from './emitter.utils';
import { validWatchfacePath } from './watchface-valid.utils';
import { useLayerStore } from '@/store/use-layer-store';
import { useImagesStore } from '@/store/use-images-store';

export const watchfaceBaseDataLoading = ref(false);

/**
 * 初始化表盘基本数据：description数据
 * @param path 路径
 */
export const loadWatchfaceData = async (path: string) => {
  const watchfaceStore = useWatchfaceStore();
  const layerStore = useLayerStore();
  const imageStore = useImagesStore();
  try {
    watchfaceBaseDataLoading.value = true;
    // 验证path和size
    const valid = !!path && (await validWatchfacePath(path));
    if (!valid) throw '同步数据失败：path无效,' + path;

    // 首先重置path 这一步非常重要，后续读取都依赖path
    watchfaceStore.setPath(path);
    await watchfaceStore.syncDescription();
    // 加载图层数据
    await layerStore.syncLayerData();
    // 加载图片数据
    await imageStore.syncImagesData();
  } catch (error) {
    console.log('INIT_WATCHFACE_DATA: failed', error);
  } finally {
    watchfaceBaseDataLoading.value = false;
    emitter.emit(EventType['watchface:description-loaded'], path);
  }
};
