import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { ElectronApi } from '@/services/electron.api';
import { descriptionToXML } from '@/utils/xmlTool';
import { Description } from '@/types/watchface';
import { useWatchfaceStore } from '@/store/use-watchface-store';
import { loadWatchfaceData } from '@/utils/watchface-load.utils';
import { emitter, EventType } from '@/utils/emitter.utils';
import { useLayerStore } from '@/store/use-layer-store';
import { useImagesStore } from '@/store/use-images-store';
import { saveConfigJson, saveImages } from '@/utils/save.utils';
import { pickWatchfacePath } from '@/utils/fs/pick-file.utils';
import { Shape } from '@/services/shape';
import { useSelectStore } from '@/store/use-select-store';
import { ensureDir } from '@/utils/fs/fs-extra.utils';
import formatXml from 'xml-formatter';
import { LayerUtils } from '@/utils/layer.util';

/**
 * 表盘正在打开状态
 */
export const watchfaceOpening = ref(false);
/**
 * 表盘正在保存状态
 */
export const watchfaceSaving = ref(false);

export const useWatchfaceManage = () => {
  const router = useRouter();
  const layerStore = useLayerStore();
  const imageStore = useImagesStore();
  const watchfaceStore = useWatchfaceStore();
  const selectStore = useSelectStore();

  /**
   * 打开新的表盘文件，并进入editor页面
   */
  const openNewWatchface = async (path: string) => {
    try {
      const editor = 'editor';
      router.push({
        name: editor,
        query: { path }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const pickAndOpenWatchfaceFile = async () => {
    try {
      //选择路径
      const { path } = (await pickWatchfacePath('all')) ?? {};
      if (!path) return;
      await openNewWatchface(path);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 创建表盘
   * @param param0
   */
  const createWatchface = async ({
    description
  }: // templatePath
  {
    description: Description;
  }) => {
    const fs = ElectronApi.fs;
    const path = ElectronApi.path;
    if (!fs || !path) return;

    // 创建本地目录，并写入信息
    const themeDir = path.join(description.address, description.name);
    await ensureDir(themeDir);
    await ensureDir(path.join(themeDir, 'resources'));

    // 写入description.xml
    const descriptionXml = descriptionToXML(description, ['address']);
    await fs.promises.writeFile(
      path.join(themeDir, 'description.xml'),
      formatXml(descriptionXml, { collapseContent: true })
    );

    // 写入config.json
    const configFile = path.join(themeDir, 'editor.config.json');
    const defaultThemeStyle = LayerUtils.getEmptyThemeStyle();
    await fs.promises.writeFile(
      configFile,
      JSON.stringify([defaultThemeStyle], undefined, 2)
    );

    emitter.emit(EventType['watchface:description-loaded'], themeDir);
  };

  const clearPreviousData = () => {
    // 清理旧数据
    watchfaceStore.$reset();
    imageStore.$reset();
    layerStore.$reset();
    selectStore.$reset();
    Shape.clearCache();
  };

  /**
   * 初始化表盘数据
   */
  const initWatchfaceData = async (path: string) => {
    try {
      watchfaceOpening.value = true;
      // 清理旧数据
      clearPreviousData();

      // 初始化数据
      try {
        if (!path) throw 'path is undefined';
        await loadWatchfaceData(path as string);
      } catch (error) {
        console.log(error);
        // 基本数据失败，则需要回到首页
        // router.replace({ name: 'home' });
        return;
      }
    } catch (error) {
      console.log('OPEN_NEW_WATCHFACE ERROR', error);
    } finally {
      watchfaceOpening.value = false;
      emitter.emit(EventType['watchface:opened']);
    }
  };

  /**
   * 保存表盘数据
   */
  const saveWatchfaceData = async () => {
    try {
      if (watchfaceSaving.value) return console.warn('忙碌，请稍后...');
      watchfaceSaving.value = true;

      const layers = layerStore.themes;
      // 保存json
      await saveConfigJson(layers);
      // 保存图片资源
      await saveImages(
        imageStore.$state.imgs.map((item) => {
          return { base64: item.value ?? '', basename: item.basename };
        })
      );
      emitter.emit(EventType['watchface:saved']);
    } catch (error) {
      console.log(error);
    } finally {
      watchfaceSaving.value = false;
    }
  };
  return {
    pickAndOpenWatchfaceFile,
    createWatchface,
    openNewWatchface,
    initWatchfaceData,
    saveWatchfaceData,
    clearPreviousData,
    watchfaceSaving
  };
};
