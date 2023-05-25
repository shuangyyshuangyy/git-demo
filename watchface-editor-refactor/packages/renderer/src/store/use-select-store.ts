import { defineStore } from 'pinia';
import { useLayerStore } from './use-layer-store';
import { EventType, emitter } from '@/utils/emitter.utils';
import { Shape } from '@/services/shape';

export const useSelectStore = defineStore('select-store', {
  state: () => {
    return {
      // 选中的元素名称
      selectedIds: [] as string[],

      // 选中的theme
      themeId: '',

      // 选择的配色
      themeColorId: '',

      activeShapes: [] as (Shape | undefined)[]
    };
  },

  getters: {
    activeShape(state) {
      return state.activeShapes[0];
    },

    /**
     * 当前选择的theme
     * @param state
     */
    theme(state) {
      const res: StoreThemeItem | undefined = useLayerStore().themes.find(
        (item) => item.id == state.themeId
      );
      return res;
    },
    /**
     * 当前选择的theme color
     * @param state
     */
    themeColor(state) {
      const res: ThemeColor | undefined = useLayerStore()
        .themes.find((item) => item.id == state.themeId)
        ?.colorGroup?.find((item) => item.id == state.themeColorId);
      return res;
    }

    // activeShape(state) {
    //   return Shape.getShape(state.selectedIds[0] ?? '');
    // }
  },

  actions: {
    /**
     * 选中
     */
    select(selectedIds: string[]) {
      this.selectedIds = selectedIds;
    },

    /**
     * 取消选中
     * @param id 要取消的id名称
     */
    unselect(id?: string) {
      this.selectedIds = id ? this.selectedIds.filter((_id) => _id !== id) : [];
    },
    /**
     * 选择theme
     * @param themeId [可选] 默认选择第一个normal的theme
     */
    selectTheme(themeId?: string) {
      if (!themeId) themeId = useLayerStore().normalThemes[0]?.id;

      this.themeId = themeId;
      this.selectThemeColor();
      // 选择主题时
      emitter.emit(EventType['theme:selected']);
    },

    /**
     * 选择theme的colorId
     * @param colorId [可选] 默认选择第一个
     */
    selectThemeColor(themeColorId?: string) {
      if (
        !themeColorId ||
        this.theme?.colorGroup.every((item) => item.id !== themeColorId)
      ) {
        themeColorId = this.theme?.colorGroup[0]?.id;
      }
      if (!themeColorId) return;
      this.themeColorId = themeColorId;
      emitter.emit(EventType['theme-color:selected']);
    }
  }
});
