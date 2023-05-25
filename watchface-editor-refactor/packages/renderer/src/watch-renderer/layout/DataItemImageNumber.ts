import getData from '../utils/getData';
// 前面补0
function setLeadingZero(str: string, totalLength: number): string {
  let result = str;
  for (let i = 0; i < totalLength; i++) {
    if (result[0] === '-') result = '-0' + result.substr(1, result.length);
    else result = '0' + result;
  }
  return result;
}

// 后面补0
function setTrailingZero(str: string, totalLength: number): string {
  let result = str;
  for (let i = 0; i < totalLength; i++) result += '0';
  return result;
}

function initCanvas(
  str: string,
  img: HTMLImageElement,
  unitIcon: HTMLImageElement,
  space: number,
  decimalOffsetX: number
) {
  let width =
    img.width * str.length + (str.length - 1) * space + decimalOffsetX;
  let height = img.height;
  if (unitIcon) {
    width = width + unitIcon.width + space;
    if (unitIcon.height > height) height = unitIcon.height;
  }
  return { width, height };
}
// 设置一个离屏画布
function initOffscreen(
  name: string,
  runtime: Runtime,
  w: number,
  h: number
): void {
  if (runtime.offscreen[name] === undefined) {
    const canvas = document.createElement('canvas');
    const numCtx = canvas.getContext('2d');
    runtime.offscreen[name] = { canvas, ctx: numCtx };
    runtime.offscreen[name].canvas.height = h;
  }
  runtime.offscreen[name].canvas.width = w;
}

function drawOffscreenNum(
  ctx: CanvasRenderingContext2D,
  str: string,
  images: LayoutImageData[],
  space: number,
  decimalOffsetX: number
) {
  let n = 0;
  for (let i = 0; i < str.length; i++) {
    const num = str[i];
    const imgIndex = num === '-' ? 10 : num === '.' ? 11 : parseInt(num);
    const image = images[imgIndex] ? images[imgIndex].data : null;
    if (image) {
      const w = image.width;
      const h = image.height;
      const nx = i * w + space * i;
      // i * w + space * i
      if (str[i] === '.') {
        n = i;
      }
      // const x = i >= n ? nx + decimalOffsetX * n : nx;
      let x = nx;
      if (n && decimalOffsetX > 0) {
        x = n && i > n - 1 ? nx + decimalOffsetX : nx;
      } else if (n && decimalOffsetX < 0) {
        x = n && i > n - 1 ? nx + decimalOffsetX : nx;
      }

      const y = 0;
      ctx.drawImage(image, x, y, w, h);
    }
  }
}

function drawUnitIcon(
  unitIcon: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  width: number
) {
  const w = unitIcon.width;
  const h = unitIcon.height;
  const x = width - w;
  const y = 0;
  ctx.drawImage(unitIcon, x, y, w, h);
}

// 设置旋转
function setTranslate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number
) {
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.translate(-x, -y);
}
export default function (
  node: DataItemImageNumber,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime,
  func?: any
): void {
  const ref = runtime.data[node.ref];

  if (ref && node.source) {
    const totalDigits = node.totalDigits ?? 0;
    const decimalDigits = node.decimalDigits ?? 0;
    const data = getData(node.source, runtime);

    // 指定小数位数
    let str =
      decimalDigits !== 0
        ? data.toFixed(decimalDigits)
        : Math.floor(data).toString();
    const totalLength = totalDigits - str.length;
    // 前面补0
    if (node.leadingZero && totalLength > 0)
      str = setLeadingZero(str, totalLength);

    // 后面补0
    if (node.trailingZero && totalLength > 0)
      str = setTrailingZero(str, totalLength);
    const unitIcon = runtime.data?.[node.unitIcon]?.data;

    if (ref.data[0]) {
      const space = node.space ?? 0;
      const decimalOffsetX = node.decimalOffsetX ?? 0;
      const { width, height } = initCanvas(
        str,
        ref.data[0].data,
        unitIcon,
        space,
        decimalOffsetX
      );
      const name = node.ref;

      const align =
        node?.align === 'center' ? -0.5 : node?.align === 'right' ? -1 : 0;
      // 初始化离屏画布
      initOffscreen(name, runtime, width, height);

      // 绘制离屏数字
      drawOffscreenNum(
        runtime.offscreen[name].ctx,
        str,
        ref.data,
        space,
        decimalOffsetX
      );

      // 绘制单位图标
      if (unitIcon) drawUnitIcon(unitIcon, runtime.offscreen[name].ctx, width);
      const x = params.x ? parseInt(params.x) : 0;
      const y = params.y ? parseInt(params.y) : 0;

      const w = params.w ? parseInt(params.w) : width;
      const h = params.h ? parseInt(params.h) : height;
      const rotation = (node.rotation * Math.PI) / 180;
      runtime.size[node.name] = { x: x + align * width, y, width, height };
      ctx.save();
      setTranslate(ctx, x, y, rotation);
      ctx.drawImage(runtime.offscreen[name].canvas, x + align * width, y, w, h);
      const colorData = {
        recolorEnable: params['recolorEnable'],
        x: x,
        y: y,
        w: w,
        h: h,
        ctx: ctx,
      };
      if (func && typeof func === 'function') {
        func(colorData); //颜色预览
      }
      ctx.restore();
    }
  }
}
