import { PointerWidget } from '@/utils/widgets.data';

export type WidgetType = (typeof PointerWidget)[number]['type'];

const pluginsMap = PointerWidget.reduce(
  (obj: Record<string, CustomWidget>, item) => {
    obj[item.type] = item;
    return obj;
  },
  {}
);

const ILLEGAL_ATTRS = ['name', 'children', 'layerName', 'ref', 'tag', 'type'];

export class WidgetService {
  type: WidgetType;

  constructor(type: WidgetType) {
    this.type = type;
  }

  get widget() {
    return pluginsMap[this.type];
  }

  static isWidget(key: string) {
    return pluginsMap[key] !== undefined;
  }

  private getLegalAttrs(
    target: CustomWidget | CustomWidgetRefItem
  ): Record<string, string | number | boolean> {
    const attrs = {};
    Object.keys(target)
      .filter((item) => !ILLEGAL_ATTRS.includes(item))
      .reduce((prev, key) => {
        prev[key] = (target as any)[key];
        return prev;
      }, attrs as any);
    return attrs;
  }

  private generateChildResAst(
    item: CustomWidgetItem | CustomWidgetRefItem,
    res: Ast[],
    id: string
  ) {
    const ast: Ast = {
      tag: item.tag,
      attrsMap: {
        name: `${item.name}_${id}`
      },
      children: []
    };
    Object.assign(ast.attrsMap, this.getLegalAttrs(item));
    if (item.ref) {
      ast.attrsMap.ref = `@${item.ref.name}_${id}`;
      this.generateChildResAst(item.ref, res, id);
    }
    if (item.children) {
      for (let child of item.children) {
        ast.children.push({
          tag: 'Item',
          attrsMap: {
            ref: `@${child.name}_${id}`,
            x: String(child.x || 0),
            y: String(child.y || 0)
          },
          children: []
        });
        this.generateChildResAst(child, res, id);
      }
    }
    res.push(ast);
  }

  generateLayoutAst(id: string): Ast {
    return {
      tag: 'Layout',
      attrsMap: {
        ref: `@${this.type}_${id}`,
        x: String(0),
        y: String(0)
      },
      children: []
    } as Ast;
  }

  generateResourceAsts(id: string): Ast[] {
    const widget = this.widget;
    const res: Ast[] = [];
    const resAsts: Ast = {
      tag: 'Widget',
      attrsMap: {
        name: `${this.type}_${id}`
      },
      children: []
    };
    Object.assign(resAsts.attrsMap, this.getLegalAttrs(widget));

    for (let child of widget.children) {
      resAsts.children.push({
        tag: 'Item',
        attrsMap: {
          x: String(child.x || 0),
          y: String(child.y || 0),
          ref: `@${child.name}_${id}`
        },
        children: []
      });
      this.generateChildResAst(child, res, id);
    }
    res.push(resAsts);
    return res;
  }

  private getLayerItem(
    item: CustomWidgetItem | CustomWidget,
    id: string
  ): StoreLayerItem {
    const layer: StoreLayerItem = {
      id: `${item.type ? item.type : (item as CustomWidgetItem).name}_${id}`,
      type: !item.type ? (item as CustomWidgetItem).tag : 'Widget',
      children: [] as StoreLayerItem[],
      attrs: {
        name: item.layerName || '',
        _isLocked: false,
        _visibility: true,
        x: 0,
        y: 0
      }
    };
    Object.assign(layer, this.getLegalAttrs(item));
    if (item.children) {
      for (let child of item.children) {
        layer.children?.push(this.getLayerItem(child, id));
      }
    }
    return layer;
  }

  generateLayer(id: string): StoreLayerItem {
    const widget = this.widget;
    return this.getLayerItem(widget, id);
  }
}
