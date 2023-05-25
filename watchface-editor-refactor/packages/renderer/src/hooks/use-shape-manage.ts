import { Shape, ShapeType } from '@/services/shape';
import { useLayerStore } from '@/store/use-layer-store';
import { ShapeUtils } from '@/services/shape/shape-util';
import { emitter, EventType } from '@/utils/emitter.utils';
import { LayerUtils } from '@/utils/layer.util';
import { pickFile } from '@/utils/fs/pick-file.utils';

export function useShapeManage() {
  const layerStore = useLayerStore();

  const updateShapes = (event: EventType) => {
    Shape.clearCache();
    emitter.emit(event);
  };

  /**
   * 图层移动操作
   * @param shapeId 待移动图层id
   * @param parentId 可选，目标父元素id, 不传默认移动至 root层
   * @param targetIndex 可选，目标位置索引，默认为 0
   */
  const moveShape = (
    shapeId: string,
    themeId: string,
    parentId?: string,
    targetIndex: number = 0
  ) => {
    const {
      layer: oldLayer,
      index: oldIndex,
      parent: oldParent
    } = layerStore.find(shapeId, themeId) ?? {};
    if (!oldLayer || oldIndex === undefined) {
      throw new Error(`图层：${shapeId} 不存在`);
    }

    if (oldLayer.type !== ShapeType.Widget && oldParent?.id != parentId) {
      throw new Error(`非widget不允许跨层移动`);
    }

    const newLayer = layerStore.moveLayer(
      shapeId,
      themeId,
      parentId,
      targetIndex
    );
    if (!newLayer) {
      throw new Error(`图层：${shapeId} 移动至 ${parentId} 失败`);
    }

    emitter.emit(EventType['shape:moved']);
  };

  const widgeted = (shapeIds: string[], themeId: string, parentId?: string) => {
    const widgetId = ShapeUtils.generateShapeName(ShapeType.Widget);
    let newLayer: StoreLayerItem = {
      id: widgetId,

      type: ShapeType.Widget,
      children: [],
      attrs: {
        name: '表达式',
        x: 0,
        y: 0,
        _isLocked: false,
        _visibility: true
      }
    };
    newLayer = layerStore.group(shapeIds, newLayer, themeId, parentId);

    updateShapes(EventType['shape:widgeted']);
  };

  const unWidgeted = (widgetId: string, themeId: string) => {
    const { layer } = layerStore.find(widgetId, themeId) || {};
    if (!layer) return;
    let newLayers: StoreLayerItem[] = [];
    if (layer.children) {
      newLayers = layer.children.map((item) => {
        LayerUtils.setAbstractAttrs(item, {
          x: layer.attrs.x,
          y: layer.attrs.y
        });
        return item;
      });
    }
    layerStore.ungroup(widgetId, newLayers, themeId);
    updateShapes(EventType['shape:unwidgeted']);
  };

  const sloted = (widgetIds: string[], themeId: string) => {
    const slotId = ShapeUtils.generateShapeName(ShapeType.Slot);
    let newLayer: StoreLayerItem = {
      id: slotId,
      type: ShapeType.Slot,
      children: [],
      attrs: { name: '容器', x: 0, y: 0, _isLocked: false, _visibility: true }
    };
    newLayer = layerStore.group(widgetIds, newLayer, themeId);

    updateShapes(EventType['shape:sloted']);
  };

  const unSloted = (slotId: string, themeId: string) => {
    const { layer } = layerStore.find(slotId, themeId) || {};
    if (!layer) return;
    let newLayers: StoreLayerItem[] = [];
    if (layer.children) {
      newLayers = layer.children.map((item) => {
        LayerUtils.setAbstractAttrs(item, {
          x: layer.attrs.x,
          y: layer.attrs.y
        });
        return item;
      });
    }
    layerStore.ungroup(slotId, newLayers, themeId);

    updateShapes(EventType['shape:unsloted']);
  };

  const pickShapeImage = async () => {
    const imagePath = (await pickFile({
      extensions: ['.png']
    })) as string | undefined;
    return imagePath;
  };

  return {
    moveShape,
    widgeted,
    unWidgeted,
    sloted,
    unSloted,
    pickShapeImage
  };
}
