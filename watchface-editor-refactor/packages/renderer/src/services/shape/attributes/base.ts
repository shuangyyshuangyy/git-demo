export class ShapeBaseAttribute {
  source?: string;

  x: number = 0;
  y: number = 0;
  w?: number;
  h?: number;

  /**
   * 图层名称
   *
   * @type {string}
   * @memberof ShapeBaseAttribute
   */
  name: string = '图层';
  _visibility: boolean = true;
  _isLocked: boolean = false;
  _collapsed?: boolean;

  resources: {
    [name: string]: ResourceItem;
  } = {};
}
