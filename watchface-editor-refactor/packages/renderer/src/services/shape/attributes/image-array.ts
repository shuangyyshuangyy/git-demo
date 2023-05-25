import { ShapeBaseAttribute } from './base';
export class ImageArrayAttribute extends ShapeBaseAttribute {
  /**
   *填充类型
   *
   * @type {('digits' | 'normal')}
   * @memberof ImageArrayAttribute
   */
  fillType?: '数字填充' | '普通填充';

  resources: {
    images?: ResourceItem;
    decimalIcon?: ResourceItem;
    unitIcon?: ResourceItem;
  } = {};
}
