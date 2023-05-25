import { useLayerStore } from '@/store/use-layer-store';
import { ShapeUtils } from './shape-util';
import ShapeAttribute from './attributes';
import generateID from '@/utils/generate-id';
import { EventType, emitter } from '@/utils/emitter.utils';
import { ShapeBaseAttribute } from './attributes/base';
import { ProgressBarAttribute } from './attributes/progress-bar';
import { TextAttribute } from './attributes/text';
import { WidgetAttribute } from './attributes/widget';
import { SlotAttribute } from './attributes/slot';
import { ImageAttribute } from './attributes/image';
import { ImageArrayAttribute } from './attributes/image-array';

export enum ShapeType {
  /**
   * 进度条（直线或弧形）
   */
  ProgressBar = 'ProgressBar',
  /**
   * 文本
   */
  Text = 'Text',
  /**
   * 表达式
   */
  Widget = 'Widget',
  /**
   * 容器
   */
  Slot = 'Slot',
  /**
   * 单图或指针
   */
  Image = 'Image',
  /**
   * 图组（数字图片或图片数值对）
   */
  ImageArray = 'ImageArray',

  /**
   * 动画序列帧
   */
  Frame = 'Frame',

  /**
   * 非协议中类型，仅编辑器使用
   */
  Group = 'Group'
  // ThreePointers = 'ThreePointers'
}

const ShapeAttributeMap = {
  [ShapeType.ProgressBar]: ProgressBarAttribute,
  [ShapeType.Text]: TextAttribute,
  [ShapeType.Widget]: WidgetAttribute,
  [ShapeType.Slot]: SlotAttribute,
  [ShapeType.Image]: ImageAttribute,
  [ShapeType.ImageArray]: ImageArrayAttribute
};

export class Shape extends ShapeAttribute {
  id: string;
  type: ShapeType;

  /**
   * 获取子元素
   *
   * @readonly
   * @type {Shape[]}
   * @memberof Shape
   */
  get children(): Shape[] {
    const { layer } = useLayerStore().findLayer(this.id) ?? {};
    const res: Shape[] = [];
    layer?.children?.forEach((child) => {
      const shape = Shape.getShape(child.id);
      if (shape) res.push(shape);
    });
    return res;
  }

  // 缓存 shape 实例
  private static instances = new Map<string, Shape>();

  private constructor(layerItem: StoreLayerItem) {
    super();
    this.id = layerItem.id;
    this.type = layerItem.type as ShapeType;
    this.initAttrs();

    Shape.instances.set(this.id, this);
  }

  /**
   * 新创建一个元素，返回shape实例
   * @param parent 元素所属theme
   * @param type 元素类型
   * @param attrs 元素属性
   */
  static create(
    theme: StoreThemeItem,
    type: ShapeType,
    attrs?: Partial<ShapeAttribute['attrs']>
  ) {
    // 基本属性
    const ShapeAttribute =
      ShapeAttributeMap[type as keyof typeof ShapeAttributeMap];
    const baseAttrs = ShapeAttribute
      ? new ShapeAttribute()
      : new ShapeBaseAttribute();

    const layerItem: StoreLayerItem = {
      id: generateID(),
      type,
      attrs: { ...baseAttrs, name: ShapeUtils.getCNName(type), ...attrs }
    };
    theme.children.push(layerItem);

    emitter.emit(EventType['shape:create']);

    return new this(layerItem);
  }

  /**
   * 获取shape
   * @params id
   */
  static getShape(id: string) {
    if (!id) return;

    if (Shape.instances.has(id)) return Shape.instances.get(id);

    const { layer } = useLayerStore().findLayer(id) ?? {};
    if (!layer) {
      console.warn('获取shape错误,数据中不存在 id=' + id);
      return;
    }

    const shape = new this(layer);
    return shape;
  }

  /**
   * 删除元素
   */
  destroy() {
    emitter.emit(EventType['shape:delete-before']);

    const { index, parent } = useLayerStore().findLayer(this.id) ?? {};

    if (parent?.children?.length && index !== undefined) {
      parent.children.splice(index, 1);
    }

    Shape.instances.delete(this.id);
    emitter.emit(EventType['shape:deleted'], this.id);
  }

  /**
   * cache shapes
   */
  private static _shapeTree = new Map<string, Shape[]>();

  /**
   * 返回树形结构的shape数据
   */
  static shapeTree(themeId: string, cache = true) {
    const cachedData = this._shapeTree.get(themeId);
    if (cache && cachedData?.length) return cachedData;

    const layerStore = useLayerStore();
    const _shapes: Shape[] = [];
    layerStore.findTheme(themeId)?.children.forEach((layerItem) => {
      const shape = this.getShape(layerItem.id);
      if (shape) _shapes.push(shape);
    });

    this._shapeTree.set(themeId, _shapes);
    return _shapes;
  }

  static clearCache() {
    this.instances.clear();
    this._shapeTree.clear();
  }
}
