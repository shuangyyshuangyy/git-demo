import getData from '../utils/getData';
export default async function (
  node: DataItemPointer,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime,
  func?: any
): Promise<void> {
  const ref = runtime.data[node.ref];
  if (ref && node.source) {
    const data = getData(node.source, runtime);
    const angleRange = node.angleRange;
    const valueRange = node.valueRange;
    const ratio = (data - node.valueStart) / valueRange;
    let rotation = node.angleStart + angleRange * ratio;
    if (valueRange > 0) {
      if (data < node.valueStart) {
        rotation = node.angleStart;
      } else if (data > valueRange + node.valueStart) {
        rotation = angleRange + node.angleStart;
      }
    } else if (valueRange < 0) {
      if (data > node.valueStart) {
        rotation = node.angleStart;
      } else if (data < valueRange + node.valueStart) {
        rotation = angleRange + node.angleStart;
      }
    }
    rotation = (rotation * Math.PI) / 180;
    const img = ref.data;
    const x = params.x ? parseInt(params.x) : 0;
    const y = params.y ? parseInt(params.y) : 0;
    const w = params.w ? parseInt(params.w) : img.width;
    const h = params.h ? parseInt(params.h) : img.height;
    const pivotX = node.pivotX;
    const pivotY = node.pivotY;
    const centerPoint = { x: x + pivotX, y: y + pivotY };
    const colorData = {
      recolorEnable: params['recolorEnable'],
      x: x,
      y: y,
      w: w,
      h: h,
      ctx: ctx,
    };
    let result: any = '';
    //首先旋转的x轴是不变的，顺时针旋转。当旋转20度，通过元素的宽度和角度，算出移动了多少的y轴
    if (func && typeof func === 'function') {
      result = await func(colorData, {
        img: img,
        type: 'DataItemPointer',
      });
    }
    const imgNode = result ? result : img;
    //img加载完成
    ctx.save();
    ctx.translate(centerPoint.x, centerPoint.y); //默认从00开始旋转，这里设置中心点，绘制到中心点位置
    ctx.rotate(rotation); //开始顺时针方向旋转角度，rotation为旋转角度。
    ctx.translate(-centerPoint.x, -centerPoint.y); //画布平移回来
    ctx.drawImage(imgNode, x, y, w, h); //绘制

    runtime.size[node.name] = {
      x,
      y,
      width: w,
      height: h,
      rotation: (rotation * 180) / Math.PI,
    };
    ctx.restore();
  }
}
