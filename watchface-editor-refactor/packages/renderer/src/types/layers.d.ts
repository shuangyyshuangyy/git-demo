interface ResourceItem {
  [colorGroup: string]: string[];
}
interface StoreLayerItem {
  id: string;
  type: string;

  // 图层分组类别,如背景、时钟等，可选
  groupTag?: string;

  // 属性信息
  attrs: {
    name: string;

    // 资源
    resources?: {
      [name: string]: ResourceItem;
    };

    [key: string]: any;
  };

  children?: StoreLayerItem[];
}

interface ThemeColor {
  id: string;
  name: string;
  color: string;
}

interface StoreThemeItem {
  id: string;
  name: string;
  type: 'normal' | 'AOD';
  colorGroup: ThemeColor[];
  children: StoreLayerItem[];
}

interface FindLayerResult {
  layer: StoreLayerItem;
  parent: StoreLayerItem | StoreThemeItem;
  index: number;
}

interface LayerOperationInfo {
  offsetX: number;
  offsetY: number;
  index: number;
}
