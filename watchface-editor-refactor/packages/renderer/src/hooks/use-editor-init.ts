import { useRoute } from 'vue-router';
import { useThemeManage, useWatchfaceManage } from '.';
import { onBeforeMount, onMounted, watch } from 'vue';
import { useSelectStore } from '@/store/use-select-store';
import { useLayerStore } from '@/store/use-layer-store';
import { useEmitterListener } from './use-event-listener';
import { EventType } from '@/utils/emitter.utils';
import { Shape } from '@/services/shape';
import { cloneDeep } from 'lodash-es';

export const useEditorInit = () => {
  const { initWatchfaceData } = useWatchfaceManage();
  const { addNormalTheme, addThemeColor } = useThemeManage();
  const layerStore = useLayerStore();
  const selectStore = useSelectStore();

  // 初始化表盘数据
  const route = useRoute();
  watch(
    () => route.query,
    async () => {
      await _init();
    },
    { deep: true }
  );

  const _init = async () => {
    const { path } = route.query ?? {};
    if (path) {
      await initWatchfaceData(path.toString());
      // 选择默认的theme
      selectStore.selectTheme();
    } else {
      console.log('未提供path，无法初始化数据');
    }
    if (!layerStore.themes?.length) {
      addNormalTheme();
    }
  };
  onMounted(async () => {
    await _init();
  });

  onBeforeMount(() => {
    // 清理旧数据
    selectStore.$reset();
  });

  useEmitterListener(EventType['theme:selected'], () => {
    if (selectStore.theme && !selectStore.themeColor) {
      addThemeColor(selectStore.theme);
    }
  });

  // 监听shape属性修改
  useEmitterListener(
    EventType['shape:set-attr'],
    (data: { shapeId: string }) => {
      const shapeId = data.shapeId;
      selectStore.activeShapes.forEach((shape) => {
        if (shape?.id == shapeId) {
          shape.attrs = cloneDeep(shape?.attrs ?? {});
        }
      });
    }
  );

  // 监听元素删除
  useEmitterListener(EventType['shape:deleted'], (themeId) => {
    if (themeId) selectStore.unselect(themeId);
  });

  watch(
    () => selectStore.selectedIds,
    (ids) => {
      if (ids.length) {
        selectStore.activeShapes = ids.map((id) => Shape.getShape(id));
      } else {
        selectStore.activeShapes = [];
      }
    }
  );
};
