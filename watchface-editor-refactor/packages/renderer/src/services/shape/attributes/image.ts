import { ShapeBaseAttribute } from './base';
export class ImageAttribute extends ShapeBaseAttribute {
  angleStart: number = 0;
  valueStart: number = 0;
  angleRange: number = 0;
  valueRange: number = 0;
  lightPointerType: 'two' | 'four' | 'none' = 'none';
  shadowPointerOffsetY: number = 0;

  resources: {
    pointer0?: ResourceItem;
    pointer1?: ResourceItem;
    pointer2?: ResourceItem;
    pointer3?: ResourceItem;
    pointerShadow?: ResourceItem;
  } = {};
}
