import getData from '../utils/getData';

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

function draw(
  runtime: Runtime,
  ctx: CanvasRenderingContext2D,
  node: DataItemImageValues,
  index: number,
  params: LayoutParamsBase,
  offsetX: number,
  offsetY: number,
  func?: any
) {
  const ref = runtime.data[node.ref];
  if (ref?.data[index]) {
    const image = ref.data[index].data;
    const x = params.x ? parseInt(params.x) : 0;
    const y = params.y ? parseInt(params.y) : 0;
    const w = params.w ? parseInt(params.w) : image.width;
    const h = params.h ? parseInt(params.h) : image.height;
    const rotation = (node.rotation * Math.PI) / 180;
    ctx.save();
    rotation && setTranslate(ctx, x, y, rotation);
    ctx.drawImage(image, x + offsetX, y + offsetY, w, h);
    const colorData = {
      recolorEnable: params['recolorEnable'],
      x: x + offsetX,
      y: y + offsetY,
      w: w,
      h: h,
      ctx: ctx,
    };
    if (func && typeof func === 'function') {
      func(colorData); //颜色预览
    }
    ctx.restore();
    runtime.size[node.name] = {
      x: x + offsetX,
      y: y + offsetY,
      width: w,
      height: h,
    };
  }
}

// 获取天气对应的数据,部分天气数据如果没有上传的话映射到特定天气上
function getWeatherData(data: number, node: DataItemImageValues) {
  const result = node.data.filter(item => {
    switch (data) {
      case 3:
        return item.value === 3 || item.value === 301; //阵雨==>雨
      case 6:
        return item.value === 6 || item.value === 33; //雨夹雪==>雪
      case 7:
        return item.value === 7 || item.value === 301; //小雨==>雨
      case 8:
        return item.value === 8 || item.value === 301; //中雨==>雨
      case 9:
        return item.value === 9 || item.value === 301; //大雨==>雨
      case 10:
        return item.value === 10 || item.value === 301; //暴雨==>雨
      case 11:
        return item.value === 11 || item.value === 301; //大暴雨==>雨
      case 12:
        return item.value === 12 || item.value === 301; //特大暴雨==>雨
      case 13:
        return item.value === 13 || item.value === 33; //阵雪==>雪
      case 14:
        return item.value === 14 || item.value === 33; //小雪==>雪
      case 15:
        return item.value === 15 || item.value === 33; //中雪==>雪
      case 16:
        return item.value === 16 || item.value === 33; //大雪==>雪
      case 17:
        return item.value === 17 || item.value === 33; //暴雪==>雪
      case 19:
        return item.value === 19 || item.value === 301; //冻雨==>雨
      case 21:
        return item.value === 21 || item.value === 301; //小到中雨==>雨
      case 22:
        return item.value === 22 || item.value === 301; //中到大雨==>雨
      case 23:
        return item.value === 23 || item.value === 301; //大到暴雨==>雨
      case 24:
        return item.value === 24 || item.value === 301; //暴雨到大暴雨==>雨
      case 25:
        return item.value === 25 || item.value === 301; //大暴雨到特大暴雨==>雨
      case 26:
        return item.value === 26 || item.value === 33; //小到中雪==>雪
      case 27:
        return item.value === 27 || item.value === 33; //中到大雪==>雪
      case 28:
        return item.value === 28 || item.value === 33; //大到暴雪==>雪
      case 29:
        return item.value === 29 || item.value === 20; //浮尘==>沙尘暴
      case 30:
        return item.value === 30 || item.value === 20; //扬沙==>沙尘暴
      case 31:
        return item.value === 31 || item.value === 20; //强沙尘暴==>沙尘暴
      case 32:
        return item.value === 32 || item.value === 18; //浓雾==>雾
      case 49:
        return item.value === 49 || item.value === 18; //强浓雾==>雾
      case 54:
        return item.value === 54 || item.value === 53; //中度霾==>霾
      case 55:
        return item.value === 55 || item.value === 53; //重度霾==>霾
      case 56:
        return item.value === 56 || item.value === 53; //严重霾==>霾
      case 57:
        return item.value === 57 || item.value === 18; //大雾==>雾
      case 58:
        return item.value === 58 || item.value === 18; //特强浓雾==>雾
      default:
        return item.value === data;
    }
  });
  return result;
}

function getNowData(data: number, values: DataItemImageValuesData[]) {
  if (values.length) {
    let index = values[0]?.index;
    let last = Math.abs(values[0].value - data);
    values.forEach((item, i) => {
      if (Math.abs(item.value - data) < last) {
        index = item.index;
        last = Math.abs(values[i].value - data);
      }
    });
    return [values[index]];
  } else return [];
}

export default function (
  node: DataItemImageValues,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime,
  func?: any
): void {
  if (node.source && node.data) {
    const data = getData(node.source, runtime) | 0;
    const nowData =
      node.source === 'weatherCurrentWeather'
        ? getWeatherData(data, node)
        : getNowData(data, node.data);
    if (nowData?.length) {
      const ref = runtime.data[node.ref];
      const index = nowData?.[0].index ?? 0;
      const offsetX = nowData?.[0].offsetX ?? 0;
      const offsetY = nowData?.[0].offsetY ?? 0;
      ref?.data?.[index] &&
        draw(runtime, ctx, node, index, params, offsetX, offsetY, func);
    } else if (node.source !== 'weatherCurrentWeather') {
      const index = data;
      const ref = runtime.data[node.ref];
      ref?.data?.[index] && draw(runtime, ctx, node, index, params, 0, 0, func);
    }
  }
}
