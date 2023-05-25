import Renderer from '@/watch-renderer';
import { useImagesStore } from '@/store/use-images-store';
import { useSelectStore } from '@/store/use-select-store';
import { defaultConfigData } from './use-canvas-config-data';
import { ref, Ref } from 'vue';
import { Shape } from '@/services/shape';
import { debounce, DebouncedFunc } from 'lodash-es';
import { buildAst } from '@/utils/ast';

interface RenderFun {
  (params?: {
    type?: 'setPosition' | 'setConfig' | string;
    clear?: boolean;
  }): Promise<void>;
}

export const useCanvasRender = (
  canvasRef: Ref<HTMLCanvasElement | undefined>
): {
  render: DebouncedFunc<RenderFun>;
  loading: Ref<boolean>;
} => {
  const imagesStore = useImagesStore();
  const selectStore = useSelectStore();
  let _renderer: Renderer | null = null;
  const loading = ref(true);

  const render: RenderFun = async () => {
    if (canvasRef.value == null) return;
    const imgs = await imagesStore.getImgDoms();
    const ast = buildAst();

    // 要渲染的主题
    const themeStyle = selectStore.theme;
    const themeStyleColor =
      selectStore.themeColor?.id ?? themeStyle?.colorGroup?.[0]?.id;
    if (!themeStyle) return;

    // 需要隐藏不显示的元素
    const hidden = selectStore.theme?.children
      ?.filter((item) => !item.attrs._visibility)
      .map((item) => item.id);

    const config: WatchRenderConfig = {
      ast: ast,
      images: imgs,
      config: { ...defaultConfigData },
      renderTheme: {
        name: themeStyle.name,
        type: themeStyle.type,
        // 图片未适配colorGroup时，先隐藏
        colorGroup: themeStyleColor,
        excludes: hidden
      }
    };
    if (_renderer == null) {
      _renderer = new Renderer(canvasRef.value, config);
    } else {
      _renderer.reset(config);
    }
    _renderer.render();

    const curSelect = selectStore.selectedIds;
    if (curSelect.length > 0) {
      const curSelectRes = curSelect[0];
      if (curSelectRes) {
        const curShape = Shape.getShape(curSelectRes as string);
        const ctx = canvasRef.value.getContext('2d');
        if (ctx && curShape && curShape?.attrs._visibility !== false) {
          ctx.beginPath();
          if (curShape.type === 'Text') {
            const textAttrs = JSON.parse(JSON.stringify(curShape)).attrs;
            ctx.rect(
              curShape?.attrs.x ?? 0,
              curShape?.attrs.y ?? 0,
              textAttrs.w ?? 50,
              textAttrs.h ?? 50
            );
          } else {
            ctx.rect(
              curShape?.attrs.x ?? 0,
              curShape?.attrs.y ?? 0,
              curShape?.attrs.w ?? 50,
              curShape?.attrs.h ?? 50
            );
          }
          ctx.strokeStyle = '#2094FF';
          ctx.stroke();
        }
      }
    }
  };
  return { render: debounce(render, 5), loading };
};
