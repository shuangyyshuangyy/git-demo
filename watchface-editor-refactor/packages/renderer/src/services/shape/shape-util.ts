import { uuidWithPrefix } from '@/utils/generate-id';
import { ShapeType } from '.';

export class ShapeUtils {
  static generateShapeName(tag: string) {
    return uuidWithPrefix(tag);
  }

  static getCNName(type: string) {
    const names: Record<string, string> = {
      [ShapeType.Text]: '文本',
      [ShapeType.ProgressBar]: '进度条',
      [ShapeType.Image]: '图片',
      [ShapeType.ImageArray]: '图组',
      [ShapeType.Slot]: '容器',
      [ShapeType.Widget]: '表达式'
    };
    return names[type] ?? type;
  }
}
