export default function (
  node: LayoutSpriteComplex,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime
): void {
  const ref = runtime.data[node.ref];

  if (ref) {
    if (node.countTime === undefined) node.countTime = Date.now();
    if (node.loopCount === undefined) node.loopCount = 0;
    if (node.interval === undefined)
      node.interval = node.data[0].interval || 10;
    if (node.imageIndex === undefined)
      node.imageIndex = node.data[0].index || 0;
    drawSpript(ref, params, ctx, node);
  }
}

function drawSpript(
  ref: ImageArray,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  node: LayoutSpriteComplex
) {
  const now = Date.now();
  if (now - node.countTime > node.interval) {
    node.loopCount += 1;
    node.interval = node.data[node.loopCount % node.data.length].interval;
    // 是否结束循环
    const loopEnd =
      node.repeatCount > 0 &&
      node.loopCount >= node.data.length * node.repeatCount;
    node.imageIndex = loopEnd
      ? node.data[node.data.length - 1].index
      : node.data[node.loopCount % node.data.length].index;
    node.countTime = Date.now();
  }

  if (ref.data[node.imageIndex]) {
    const image = ref.data[node.imageIndex].data;
    if (image) {
      const x = params.x ? parseInt(params.x) : 0;
      const y = params.y ? parseInt(params.y) : 0;
      const w = params.w ? parseInt(params.w) : image.width;
      const h = params.h ? parseInt(params.h) : image.height;
      ctx.drawImage(
        image,
        x + node.data[node.imageIndex].offsetX,
        y + node.data[node.imageIndex].offsetY,
        w,
        h
      );
    }
  }
}
