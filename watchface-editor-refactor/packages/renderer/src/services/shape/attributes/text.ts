import { ShapeBaseAttribute } from './base';

export class TextAttribute extends ShapeBaseAttribute {
  fontId: string = 'misansw';
  fontSize = 20;
  fontWeight: string = 'normal';
  color: string = '#ffffff';
  style: string = 'normal';
  align: string = 'left';
  longMode: string = 'dot';
  letterSpace = 0;
  lineSpace = 0;
  rotation = 0;
  radius = 0;
  startAngle = 0;
  span = 0;
  /**
   * 文本内容
   *
   * @type {string}
   * @memberof TextAttribute
   */
  string: string = '';
}
