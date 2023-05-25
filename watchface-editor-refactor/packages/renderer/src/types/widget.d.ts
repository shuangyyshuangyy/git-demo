type CustomWidgetRefItem = Omit<CustomWidgetItem, 'x' | 'y'>;

interface CustomWidgetItem {
  tag: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  name: string;
  layerName?: string;
  children?: CustomWidgetItem[];
  ref?: CustomWidgetRefItem;
  [
    key: Exclude<string, 'x' | 'y' | 'tag' | 'layerName' | 'children' | 'ref'>
  ]: any;
}

interface CustomWidget {
  type: string;
  layerName: string;
  w: number;
  h: number;
  preview?: string;
  children: CustomWidgetItem[];
}

/**
 * 数据源格式
 */
interface SourceFormat {}
