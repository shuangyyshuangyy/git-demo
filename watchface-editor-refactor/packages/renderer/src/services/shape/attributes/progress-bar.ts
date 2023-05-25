import { ShapeBaseAttribute } from './base';

export class ProgressBarAttribute extends ShapeBaseAttribute {
  angleStart = 0;
  angleEnd = 90;
  valueStart = 0;
  valueEnd = 0;
  barWidth = 20;
  endingStyle: 'normal' | 'round' = 'normal';
  progress = 75;
  type: 'arc' | 'line' = 'line';
  /**
   *进度条方向
   */
  dir: 'clockwise' | 'counter-clockwise' | 'to-right' | 'to-left' = 'to-right';

  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;

  resources: {
    bg?: ResourceItem;
    progress?: ResourceItem;
  } = {};
}
