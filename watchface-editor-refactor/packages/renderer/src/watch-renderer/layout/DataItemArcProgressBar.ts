import getData from '../utils/getData';

function initOffscreen(runtime: Runtime, name: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  runtime.offscreen[name] = { canvas, ctx };
}

function initCanvas(params: LayoutParamsBase, width: number, height: number) {
  const x = params.x ? parseInt(params.x) : 0;
  const y = params.y ? parseInt(params.y) : 0;
  const w = params.w ? parseInt(params.w) : width;
  const h = params.h ? parseInt(params.h) : height;
  return { x, y, w, h };
}

// 绘制弧形图底色背景
function drawBg(
  params: LayoutParamsBase,
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  func?: any
) {
  const w = params.w ? parseInt(params.w) : img.width;
  const h = params.h ? parseInt(params.h) : img.height;
  ctx.drawImage(img, x, y, w, h);
  const colorData = {
    recolorEnable: params['recolorEnable'],
    x: x,
    y: y,
    w: w,
    h: h,
    ctx: ctx,
  };
  if (func && typeof func === 'function') {
    func(colorData);
  }
}

// 绘制离屏画布背景
function drawOffscreenBG(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  func?: any,
  recolorEnable?: string
) {
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  if (func && typeof func === 'function') {
    const colorData = {
      recolorEnable: recolorEnable,
      x: 0,
      y: 0,
      w: width,
      h: height,
      ctx: ctx,
    };
    func(colorData);
  }
}

// 绘制离屏画布弧线
function drawOffscreenArc(
  node: DataItemArcProgressBar,
  ctx: CanvasRenderingContext2D,
  angleStart: number,
  angleEnd: number
) {
  const pivotX = node.pivotX;
  const pivotY = node.pivotY;
  const r = node.barRadius;

  if (node.endingStyle && node.endingStyle === 'round') ctx.lineCap = 'round';
  const barWidth = node.barWidth;
  ctx.globalCompositeOperation = 'destination-in';
  ctx.lineWidth = barWidth;
  ctx.beginPath();
  ctx.arc(
    pivotX,
    pivotY,
    r,
    (angleStart * Math.PI) / 180,
    (angleEnd * Math.PI) / 180,
    node.angleRange < 0
  );
  ctx.stroke();
}

// 绘制指示器
function drawIndicator(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  centerX: number,
  centerY: number,
  radius: number,
  angleEnd: number
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(((angleEnd - 90) * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    img,
    centerX - img.width / 2,
    radius + centerY - img.height / 2
  );
  ctx.restore();
}

export default function (
  node: DataItemArcProgressBar,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime,
  func?: any
): void {
  const ref = runtime.data[node.ref];
  const bg = runtime.data[node.bg];
  if (ref && node.source) {
    const data = getData(node.source, runtime);
    const refImg = ref.data;
    const refImgWidth = refImg.width;
    const refImgHeight = refImg.height;
    const pivotX = node.pivotX;
    const pivotY = node.pivotY;
    const r = node.barRadius;
    const name = node.ref;
    // 初始化一个离屏画布
    if (runtime.offscreen[name] === undefined) initOffscreen(runtime, name);
    const { x, y, w, h } = initCanvas(params, refImgWidth, refImgHeight);
    if (bg?.data) drawBg(params, bg.data, ctx, x, y, func);
    // 绘制离屏画布背景
    drawOffscreenBG(
      runtime.offscreen[name].canvas,
      runtime.offscreen[name].ctx,
      refImg,
      refImgWidth,
      refImgHeight,
      func,
      params['recolorEnable']
    );

    // 扫描起始角
    const angleStart = (node.angleStart - 90) % 360;

    const angleRange = node.angleRange;
    const valueRange = node.valueRange;
    // 进度比例
    const ratio = (data - node.valueStart) / valueRange;
    // 扫描结束角
    let angleEnd = node.angleStart + angleRange * ratio;
    if (valueRange > 0) {
      if (data < node.valueStart) {
        angleEnd = node.angleStart;
      } else if (data > valueRange + node.valueStart) {
        angleEnd = angleRange + node.angleStart;
      }
    } else if (valueRange < 0) {
      if (data > node.valueStart) {
        angleEnd = node.angleStart;
      } else if (data < valueRange + node.valueStart) {
        angleEnd = angleRange + node.angleStart;
      }
    }
    angleEnd = angleEnd - 90;
    // 绘制离屏画布弧线
    drawOffscreenArc(node, runtime.offscreen[name].ctx, angleStart, angleEnd);

    // 将离屏画布绘制到视图中
    ctx.drawImage(runtime.offscreen[name].canvas, x, y, w, h);
    runtime.size[node.name] = { x, y, width: w, height: h };
    if (node.indicatorImage) {
      const img = runtime.data[node.indicatorImage]?.data;
      if (img) {
        const centerX = x + pivotX;
        const centerY = y + pivotY;
        const radius = node.indicatorRadius ?? r;
        // 绘制指示器
        drawIndicator(ctx, img, centerX, centerY, radius, angleEnd);
      }
    }
  }
}
