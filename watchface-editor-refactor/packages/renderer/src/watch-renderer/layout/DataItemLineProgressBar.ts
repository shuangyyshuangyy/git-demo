import getData from '../utils/getData';

// 初始化离屏画布
function initOffscreen(runtime: Runtime, name: string): void {
  if (runtime.offscreen[name] === undefined) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    runtime.offscreen[name] = { canvas, ctx };
  }
}

// 获取位置及尺寸
function getSize(params: LayoutParamsBase, img: HTMLImageElement) {
  const x = params.x ? parseInt(params.x) : 0;
  const y = params.y ? parseInt(params.y) : 0;
  const w = params.w ? parseInt(params.w) : img.width;
  const h = params.h ? parseInt(params.h) : img.height;
  return { x, y, w, h };
}

// 绘制背景
function drawBg(
  params: LayoutParamsBase,
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  const w = params.w ? parseInt(params.w) : img.width;
  const h = params.h ? parseInt(params.h) : img.height;
  ctx.drawImage(img, x, y, w, h);
}

// 绘制进度条
function drawProgress(
  ctx: CanvasRenderingContext2D,
  node: DataItemLineProgressBar,
  startX: number,
  startY: number,
  finishX: number,
  finishY: number
) {
  if (node.endingStyle && node.endingStyle === 'round') ctx.lineCap = 'round';
  const barWidth = node.barWidth;
  ctx.globalCompositeOperation = 'destination-in';
  ctx.lineWidth = barWidth;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(finishX, finishY);
  ctx.stroke();
  ctx.closePath();
}

// 绘制指示点
function drawIndicator(
  img: HTMLImageElement | undefined,
  ctx: CanvasRenderingContext2D,
  node: DataItemLineProgressBar,
  x: number,
  y: number,
  finishX: number,
  finishY: number
) {
  if (img) {
    const offsetX = node.indicatorOffsetX ?? 0;
    const offsetY = node.indicatorOffsetY ?? 0;
    const ix = x + finishX - img.width / 2 + offsetX;
    const iy = y + finishY - img.height / 2 + offsetY;
    ctx.drawImage(img, ix, iy);
  }
}
export default function (
  node: DataItemLineProgressBar,
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

    const startX = node.startX;
    const startY = node.startY;
    const endX = node.endX;
    const endY = node.endY;

    const name = node.ref;
    // 初始化一个离屏画布
    initOffscreen(runtime, name);
    const { x, y, w, h } = getSize(params, refImg);

    if (bg?.data) drawBg(params, bg.data, ctx, x, y);
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

    runtime.offscreen[name].canvas.width = refImgWidth;
    runtime.offscreen[name].canvas.height = refImgHeight;
    runtime.offscreen[name].ctx.drawImage(refImg, 0, 0);
    if (func && typeof func === 'function') {
      func({
        recolorEnable: params['recolorEnable'],
        x: 0,
        y: 0,
        w: refImgWidth,
        h: refImgHeight,
        ctx: runtime.offscreen[name].ctx,
      });
    }

    // // 进度比例
    let ratio = (data - node.valueStart) / node.valueRange;
    if (node.valueRange > 0) {
      if (data < node.valueStart) {
        ratio = 0;
      } else if (data > node.valueRange + node.valueStart) {
        ratio = 1;
      }
    } else if (node.valueRange < 0) {
      if (data > node.valueStart) {
        ratio = 0;
      } else if (data < node.valueRange + node.valueStart) {
        ratio = 1;
      }
    }

    const spaceX = endX - startX;
    const spaceY = endY - startY;

    const finishX = spaceX ? startX + spaceX * ratio : endX;
    const finishY = spaceY ? startY + spaceY * ratio : endY;
    drawProgress(
      runtime.offscreen[name].ctx,
      node,
      startX,
      startY,
      finishX,
      finishY
    );
    ctx.drawImage(runtime.offscreen[name].canvas, x, y, w, h);
    runtime.size[node.name] = { x, y, width: w, height: h };
    if (node.indicatorImage) {
      const img = runtime.data[node.indicatorImage]?.data;
      drawIndicator(img, ctx, node, x, y, finishX, finishY);
    }
  }
}
