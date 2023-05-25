import { FolderService } from '@/services/folder.service';
import { Description } from '@/types/watchface';
import { defineStore } from 'pinia';

interface WatchfaceItem {
  path: string;
  name: string;
  compressionType: string;
  size?: {
    w: string;
    h: string;
  };
  //宽高 名字 压缩方法
}

export const useWatchfaceStore = defineStore('Watchface-store', {
  state: () => ({
    Watchface: {} as WatchfaceItem,
    description: undefined as Description | undefined
  }),
  getters: {
    path(state) {
      return state.Watchface.path;
    },
    watchface(state) {
      return state.Watchface;
    }
  },
  actions: {
    update(wgt: WatchfaceItem) {
      Object.assign(this.$state.Watchface, wgt);
    },

    async syncDescription() {
      const res = await new FolderService().getDescriptionData();
      this.$state.description = res;
      if (res) {
        this.$state.Watchface.name = res.name;
        this.$state.Watchface.compressionType = res.imageCompression
          ? res.deviceType == 'L61'
            ? 'RLE'
            : 'RLEReversed'
          : '';
        let [width, height] = res.size.split('x');
        this.$state.Watchface.size = {
          w: width,
          h: height
        };
      }
    },
    setPath(path?: string) {
      if (path) this.$state.Watchface.path = path;
    }
  }
});
