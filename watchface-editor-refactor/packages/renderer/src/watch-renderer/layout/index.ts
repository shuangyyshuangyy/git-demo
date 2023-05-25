import Image from './Image';
import DataItemImageValues from './DataItemImageValues';
import DataItemPointer from './DataItemPointer';
import DataItemImageNumber from './DataItemImageNumber';
import DataItemArcProgressBar from './DataItemArcProgressBar';
import DataItemLineProgressBar from './DataItemLineProgressBar';
import DataItemText from './DataItemText';
// todo 跨元素对齐组件 自定义组件 文本 slot widget

async function previewColor(val: any, CanvasPrams?: CanvasPrams) {
  // todo
  // const state: any = store.state; //获取state
  // const recolorTableColor = state.recolorTableColor; //获取到state里面的当前需要预览的颜色
  const recolorTableColor = { r: 255, g: 255, b: 255 };
  const renderType = 'normal'; //当前是什么主题
  const r = recolorTableColor && recolorTableColor.r; //需要预览颜色的r
  const g = recolorTableColor && recolorTableColor.g; //需要预览颜色的g
  const b = recolorTableColor && recolorTableColor.b; //需要预览颜色的b
  const description: any = ''; //获取全局维护的description的描述信息
  const _recolorEnable = description._recolorEnable; //获取全局维护的description的颜色全局开关信息
  const recolorEnable = val.recolorEnable; //当前是否可着色
  const x = val.x;
  const y = val.y;
  const w = val.w;
  const h = val.h;
  const ctx = val.ctx;
  let imgdata: any = '';
  if (renderType && r !== undefined && g !== undefined && b !== undefined) {
    //当为颜色样式并且有vuex的颜色数据的时候，进行图片颜色的预览。
    if (
      _recolorEnable ||
      (!_recolorEnable && recolorEnable && recolorEnable === 'true')
    ) {
      const canvas = document.createElement('canvas'),
        ctx1 = canvas.getContext('2d');
      if (CanvasPrams?.type && CanvasPrams.type === 'DataItemPointer') {
        //当我为指针类型，需要动态创建canvas数据给属性上
        canvas.width = w;
        canvas.height = h;
        ctx1?.drawImage(CanvasPrams.img, 0, 0, w, h); //动态绘制img图片元素
        imgdata = ctx1?.getImageData(0, 0, w, h); //imgdata为当前元素
      } else {
        imgdata = ctx.getImageData(x, y, w, h);
      }
      for (let index = 0; index < imgdata.data.length; index += 4) {
        imgdata.data[index] = (imgdata.data[index] * r) / 255;
        imgdata.data[index + 1] = (imgdata.data[index + 1] * g) / 255;
        imgdata.data[index + 2] = (imgdata.data[index + 2] * b) / 255;
      }
      if (CanvasPrams?.type && CanvasPrams.type === 'DataItemPointer') {
        ctx1?.putImageData(imgdata, 0, 0);
        const base64 = canvas.toDataURL('image/png'); //返回base64的URL
        const imgNode = document.createElement('img');
        imgNode.src = base64;
        const test = async function () {
          return new Promise((res, rej) => {
            imgNode.onload = () => {
              res(imgNode);
            };
          });
        };
        return await test();
      } else {
        ctx.putImageData(imgdata, x, y);
      }
    }
  }
}
export default function (
  node: Ast,
  runtime: Runtime,
  ctx: CanvasRenderingContext2D
): void {
  node?.children?.forEach((item: Ast) => {
    const ref = item.attrsMap.ref as string;
    if (!ref) return;

    // 判断是否需要隐藏
    if (runtime.renderTheme.excludes?.includes(ref.replace('@', ''))) return;

    const refData = runtime.data[ref as string];
    switch (refData?.type ?? '') {
      case 'Image':
        const CustomParams: CustomPrams = {
          recolorEnable: refData.recolorEnable
        };
        refData.data &&
          Image(refData.data, item.attrsMap, ctx, CustomParams, previewColor);
        break;
      case 'DataItemImageValues':
        DataItemImageValues(refData, item.attrsMap, ctx, runtime, previewColor);
        break;
      case 'DataItemPointer':
        DataItemPointer(refData, item.attrsMap, ctx, runtime, previewColor);
        break;
      case 'DataItemText':
        DataItemText(refData, item.attrsMap, ctx, runtime);
      case 'DataItemImageNumber':
        DataItemImageNumber(refData, item.attrsMap, ctx, runtime, previewColor);
        break;
      case 'DataItemArcProgressBar':
        DataItemArcProgressBar(
          refData,
          item.attrsMap,
          ctx,
          runtime,
          previewColor
        );
        break;
      case 'DataItemLineProgressBar':
        DataItemLineProgressBar(
          refData,
          item.attrsMap,
          ctx,
          runtime,
          previewColor
        );
        break;
      default:
        break;
    }
  });
}
