import { Shape } from '@/services/shape';
import { useSelectStore } from '@/store/use-select-store';

export const useCanvasSelect = (event: MouseEvent) => {
  const { offsetX, offsetY } = event;
  const selectStore = useSelectStore();

  const selectLayout = selectStore.theme?.children.find((val) => {
    const name = val.id;
    const curShape = Shape.getShape(name);
    if (curShape) {
      if (curShape.attrs._isLocked === true) return false;
      let width = 50;
      let height = 50;
      width = curShape.attrs.w ?? 50;
      height = curShape.attrs.h ?? 50;
      const layoutX = Number(curShape.attrs.x);
      const layoutY = Number(curShape.attrs.y);
      const xAxis = layoutX < offsetX && layoutX + Number(width) > offsetX;
      const yAxis = layoutY < offsetY && layoutY + Number(height) > offsetY;
      return xAxis && yAxis;
    }
  });
  if (selectLayout) {
    const selectName = selectLayout.id;
    selectStore.select([selectName]);
    return true;
  } else {
    selectStore.unselect();
    return false;
  }
};

export const useCanvasDrag = (
  event: MouseEvent,
  selectNames: string[],
  offsetXToLeft: number,
  offsetYToTop: number
) => {
  const { offsetX, offsetY } = event;
  for (const name of selectNames) {
    // todo 更改类型
    const curShape = Shape.getShape(name);
    if (curShape) {
      curShape.setAttrs({
        x: offsetX - offsetXToLeft,
        y: offsetY - offsetYToTop
      });
    }
  }
};
