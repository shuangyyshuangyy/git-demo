import { FolderService, ResourceItem } from '@/services/folder.service';
import { getImageBase64, loadImageDom } from '@/utils/fs/image.utils';
import { defineStore } from 'pinia';
import { fileToMd5 } from '@/utils/md5.utils';
import { ElectronApi } from '@/services/electron.api';

const _imgDomsCache = new Map<string, HTMLImageElement>();

export const useImagesStore = defineStore('images-store', {
  state: () => ({
    imgs: [] as ResourceItem[]
  }),

  getters: {
    /**
     * 获取所有图片
     */
    images(state) {
      return state.imgs ?? [];
    },

    /**
     * 获取所有图片dom
     */
    getImgDoms() {
      return async () => {
        const imgsData = this.images;
        const imgs: RuntimeImages = {};

        // 获取数据
        for (let i = 0; i < imgsData.length; i++) {
          const { basename, value } = imgsData[i];

          // 如果缓存不存在
          if (!_imgDomsCache.has(basename)) {
            try {
              const dom = await loadImageDom(value as string);
              if (dom) _imgDomsCache.set(basename, dom);
            } catch (error) {
              // console.log(error);
            }
          }

          const dom = _imgDomsCache.get(basename);
          if (dom) imgs[basename] = dom;
        }
        return imgs;
      };
    },

    /**
     * 批量获取图片对象
     * @param state
     * @returns
     */
    getImgs(state) {
      return (imgKeys: string[]) => {
        return state.imgs.filter((item) => imgKeys.includes(item.basename));
      };
    },

    /**
     * 获取单个图片对象
     * @param state
     * @returns
     */
    image(state) {
      return (basename: string) => {
        return state.imgs.find((item) => item.basename == basename);
      };
    }
  },

  actions: {
    /**
     * 同步本地目录中的图片
     */
    async syncImagesData() {
      const res = await new FolderService().getImagesData();
      if (res) {
        _imgDomsCache.clear();
        this.$state.imgs = res;
      }
    },

    async writeImageToStore(imgName: string, base64: string) {
      const res = await new FolderService().getImageStoreData(imgName, base64);
      if (res) {
        const ifStore = this.$state.imgs.findIndex(
          (img) => img.basename === res.basename
        );
        ifStore === -1 && this.$state.imgs.push(res);
      }
    },

    /**
     * 添加图片
     * @param imgPath 图片在本地的实际名称
     * @param basename 上一级的basename
     * @returns 返回在store中的图片名称，即maml中使用的名称
     */
    async addImage(imgPath: string, basename?: string) {
      const path = ElectronApi.path;
      if (!path) return;

      const md5 = (await fileToMd5(imgPath)) + path.extname(imgPath);
      const name = basename ? basename + '/' + md5 : md5;
      const base64 = await getImageBase64(imgPath);

      const index = this.imgs.findIndex((item) => item.basename == name);
      if (index > -1) this.imgs.splice(index, 1);
      this.imgs.push({
        realpath: imgPath,
        basename: name,
        value: base64
      });

      return this.image(name);
    },

    /**
     * 使用新图片数据替换原有的图片数据
     * @param imgs
     */
    resetImages(imgs: ResourceItem[]) {
      this.$state.imgs = imgs;
    }
  }
});
