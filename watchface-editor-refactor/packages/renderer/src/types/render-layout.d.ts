interface LayoutParamsBase {
  [key: string]: string;
}

interface DataItemPointer {
  angleRange: number;
  valueRange: number;
  pivotX: number;
  pivotY: number;
  name: string;
  ref: string;
  projectionImg: string;
  ref2: string;
  ref3: string;
  ref4: string;
  source: WatchSource;
  angleStart: number;
  valueStart: number;
  parameter: number;
  type: 'DataItemPointer';
  supportRecolor: string;
  _projectionOffset: number;
}

interface DataItemImageValues {
  data: DataItemImageValuesData[];
  name: string;
  ref: string;
  source: WatchSource;
  rotation: number;
  type: 'DataItemImageValues';
  supportRecolor: boolean;
}
interface DataItemImageValuesData {
  value: number;
  offsetX: number;
  offsetY: number;
  index: number;
}
interface DataItemImageNumber {
  align: string;
  name: string;
  leadingZero: boolean;
  trailingZero: boolean;
  ref: string;
  source: WatchSource;
  totalDigits: number;
  decimalDigits: number;
  rotation: number;
  space: number;
  unitIcon: string;
  type: 'DataItemImageNumber';
  supportRecolor: string;
  renderRule: string;
  decimalOffsetX: number;
}

interface LayoutImageData {
  data: HTMLImageElement;
  src: string;
  name: string;
  type: 'Image';
}

interface ImageArray {
  data: LayoutImageData[];
  ref: string;
  source: WatchSource;
  type: 'ImageArray';
  countTime: number;
  recolorEnable: boolean;
}

interface LayoutSprite {
  ref: string;
  name: string;
  interval: number;
  repeatCount: number;
  loopCount: number;
  type: 'Sprite';
  countTime: number;
  imageIndex: number;
}
interface LayoutSpriteComplex {
  ref: string;
  name: string;
  interval: number;
  repeatCount: number;
  loopCount: number;
  type: 'SpriteComplex';
  countTime: number;
  imageIndex: number;
  data: LayoutSpriteComplexData[];
}

interface LayoutSpriteComplexData {
  offsetX: number;
  offsetY: number;
  interval: number;
  index: number;
  alpha: number;
}

interface DataItemArcProgressBar {
  ref: string;
  name: string;
  bg: string;
  source: WatchSource;
  pivotX: number;
  pivotY: number;
  angleStart: number;
  valueStart: number;
  angleRange: number;
  valueRange: number;
  barRadius: number;
  barWidth: number;
  endingStyle: 'normal' | 'round';
  indicatorImage: string;
  indicatorRadius: number;
  type: 'DataItemArcProgressBar';
  supportRecolor: string;
}

interface LayoutWidget {
  name: string; //该资源的名字，全局唯一
  align: string; //暂未使用，默认为left
  preview: string; //小部件编辑状态预览图
  bg: string; //小组件的额背景图
  bgColor: string; //小组件的背景颜色
  editBox: string; //小组件的编辑提示框图
  icon: string; //小组件的静态图标
  groupType: string; //小组件的组别类型
  data: LayoutWidgetData[]; //小组件的名字
  type: 'Widget';
  w: string;
  h: string;
  flex_direction: string; // 布局方向
  justify_content: string; // 主轴布局
  align_content: string; // 交叉布局
  align_items: string; // 元素间布局
  gap: string; // 元素间最小距
}
interface LayoutCustomWidget {
  name: string; //该资源的名字，全局唯一
  align: string; //暂未使用，默认为left
  preview: string; //小部件编辑状态预览图
  bg: string; //小组件的额背景图
  bgColor: string; //小组件的背景颜色
  editBox: string; //小组件的编辑提示框图
  icon: string; //小组件的静态图标
  groupType: string; //小组件的组别类型
  data: LayoutWidgetData[]; //小组件的名字
  type: 'CustomWidget'; //小组件的名字
  w: string;
  h: string;
  flex_direction: string; // 布局方向
  justify_content: string; // 主轴布局
  align_content: string; // 交叉布局
  align_items: string; // 元素间布局
  gap: string; // 元素间最小距
}

interface LayoutWidgetData {
  x: number;
  y: number;
  ref: string;
}

interface LayoutSlot {
  includeApps: boolean;
  data: LayoutSlotData[];
  type: 'Slot';
  name: string;
}
interface LayoutSlotData {
  ref: string;
}

interface DataItemLineProgressBar {
  ref: string;
  name: string;
  bg: string;
  source: WatchSource;
  barWidth: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  valueStart: number;
  valueRange: number;
  endingStyle: 'normal' | 'round';
  indicatorImage: string;
  indicatorOffsetX: number;
  indicatorOffsetY: number;
  type: 'DataItemLineProgressBar';
  supportRecolor: string;
}

interface DataItemText {
  name: string;
  fontId: string;
  fontWeight: string;
  fontSize: number;
  color: string;
  style: string;
  align: string;
  longMode: string;
  w: number;
  h: number;
  lineSpace: string;
  rotation: number;
  radius: number;
  startAngle: number;
  span: number;
  radius: number;
  string: string;
  bold: boolean;
  letterSpace: number;
  type: 'DataItemText';
  [key: string]: string | boolean | number;
}
