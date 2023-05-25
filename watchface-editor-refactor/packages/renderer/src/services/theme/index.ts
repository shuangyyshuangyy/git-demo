import { useLayerStore } from '@/store/use-layer-store';
import { ShapeUtils } from './shape-util';
import ShapeAttribute from './attributes';
import generateID from '@/utils/generate-id';
import { EventType, emitter } from '@/utils/emitter.utils';

export class Theme {
  readonly id: string;
  name: string = '样式';
  readonly type: 'normal' | 'AOD';
  colorGroup: ThemeColor[] = [];

  // 缓存 shape 实例
  private static instances = new Map<string, Theme>();

  private constructor(layerItem: StoreLayerItem) {
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
    const layerItem: StoreLayerItem = {
      id: generateID(),
      type,
      attrs: { name: ShapeUtils.getCNName(type), ...attrs }
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
