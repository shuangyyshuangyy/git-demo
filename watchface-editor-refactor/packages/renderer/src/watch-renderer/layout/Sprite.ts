export default function (
  node: LayoutSprite,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime,
  func?: any
): void {
  const ref = runtime.data[node.ref];

  if (ref) {
    if (node.countTime === undefined) node.countTime = Date.now();
    if (node.loopCount === undefined) node.loopCount = 0;
    if (node.imageIndex === undefined) node.imageIndex = 0;
    drawSpript(ref, params, ctx, node, func);
  }
}

function drawSpript(
  ref: ImageArray,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  node: LayoutSprite,
  func?: any
) {
  const now = Date.now();

  if (now - node.countTime > node.interval) {
    node.loopCount += 1;
    const loopEnd =
      node.repeatCount > 0 &&
      node.loopCount >= ref.data.length * node.repeatCount;
    node.imageIndex = loopEnd
      ? ref.data.length - 1
      : node.loopCount % ref.data.length;
    node.countTime = Date.now();
  }

  if (ref.data[node.imageIndex]) {
    const image = ref.data[node.imageIndex].data;
    if (image) {
      const x = params.x ? parseInt(params.x) : 0;
      const y = params.y ? parseInt(params.y) : 0;
      const w = params.w ? parseInt(params.w) : image.width;
      const h = params.h ? parseInt(params.h) : image.height;
      ctx.drawImage(image, x, y, w, h);
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
  }
}
