import Image from './Image';
import ImageArray from './ImageArray';
import DataItemImageValues from './DataItemImageValues';
import DataItem from './DataItem';
import Sprite from './Sprite';
import Widget from './Widget';
import SpriteComplex from './SpriteComplex';
import CustomWidget from './CustomWidget';

/**
 * @method 解析处理数据
 * @param {object} runtime  运行时数据
 */
export default function (runtime: Runtime): void {
  // 需要选择具体colorGroup的元素
  const tagsWithColorGroup = ['Image', 'ImageArray'];
  const resources = runtime.resources;
  const colorGroup = runtime.renderTheme.colorGroup;
  resources.children
    ?.filter((item) => {
      if (tagsWithColorGroup.includes(item.tag)) {
        const _colorGroup = item.attrsMap.colorGroup;
        return colorGroup ? _colorGroup == colorGroup : !_colorGroup;
      } else {
        return true;
      }
    })
    .forEach((item: Ast) => {
      switch (item.tag) {
        case 'Image':
          Image(item, runtime);
          break;
        case 'ImageArray':
          //数字图片、图组、序列帧都会走ImageArray
          ImageArray(item, runtime);
          break;
        case 'DataItemImageValues':
          DataItemImageValues(item, runtime);
          break;
        case 'DataItemPointer':
        case 'DataItemImageNumber':
        case 'DataItemArcProgressBar':
        case 'DataItemLineProgressBar':
        case 'DataItemText':
          DataItem(item, runtime, item.tag);
          break;
        case 'Sprite':
          Sprite(item, runtime);
          break;
        case 'SpriteComplex':
          SpriteComplex(item, runtime);
          break;
        case 'Slot':
        case 'Widget':
          Widget(item, runtime, item.tag);
          break;
        case 'CustomWidget':
          CustomWidget(item, runtime, item.tag);
          break;
        default:
          break;
      }
    });
}
