import generateID from './generate-id';

interface LayersRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class LayerUtils {
  static calcLayersRect(layers: StoreLayerItem[]): LayersRect {
    let minX = 0,
      minY = 0,
      maxW = 0,
      maxH = 0;
    for (let layer of layers) {
      minX = Math.min(minX, Number(layer.attrs.x));
      minY = Math.min(minY, Number(layer.attrs.y));
      maxW = Math.max(maxW, Number(layer.attrs.x) + Number(layer.attrs.w || 0));
      maxH = Math.max(maxH, Number(layer.attrs.y) + Number(layer.attrs.h || 0));
    }
    return {
      x: minX,
      y: minY,
      w: maxW,
      h: maxH
    };
  }

  static setRelativeAttrs(
    layer: StoreLayerItem,
    rect: Omit<LayersRect, 'w' | 'h'>
  ) {
    layer.attrs.x = layer.attrs.x - rect.x;
    layer.attrs.y = layer.attrs.y - rect.y;
  }

  static setAbstractAttrs(
    layer: StoreLayerItem,
    rect: Omit<LayersRect, 'w' | 'h'>
  ) {
    layer.attrs.x = layer.attrs.x + rect.x;
    layer.attrs.y = layer.attrs.y + rect.y;
  }

  static getEmptyThemeStyle(): StoreThemeItem {
    return {
      id: generateID(),
      name: '样式1',
      type: 'normal',
      children: [],
      colorGroup: [
        {
          id: generateID(),
          name: '配色1',
          color: '#ffffff'
        }
      ]
    };
  }

  /**
   * 返回唯一的theme名称
   * @returns
   */
  static uniqueThemeName = (existsNames: string[], basename: string) => {
    const reg = /\d{1,}$/g;
    const res = basename.match(reg);
    let flag = +(res?.[0] ?? 0);
    const flag2 = flag;
    let _basename = basename;
    basename = basename.replace(/\d{1,}$/g, '');
    console.log(_basename, flag);

    existsNames.forEach((existsName: any) => {
      if (existsName == _basename) {
        flag++;
        _basename = flag > flag2 ? basename + '' + flag : basename;
      }
    });

    return _basename;
  };
}
