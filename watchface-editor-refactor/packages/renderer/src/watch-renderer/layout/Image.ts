export default function (
  data: HTMLImageElement,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  customPrams?: CustomPrams,
  func?: any
): void {
  const x = params.x ? parseInt(params.x) : 0;
  const y = params.y ? parseInt(params.y) : 0;
  const w = params.w ? parseInt(params.w) : data.width;
  const h = params.h ? parseInt(params.h) : data.height;
  ctx.drawImage(data, x, y, w, h);
  const colorData = {
    recolorEnable: customPrams?.recolorEnable,
    x: x,
    y: y,
    w: w,
    h: h,
    ctx: ctx
  };
  if (func && typeof func === 'function') {
    func(colorData);
  }
}
