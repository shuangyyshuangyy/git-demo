export default function (
  node: DataItemText,
  params: LayoutParamsBase,
  ctx: CanvasRenderingContext2D,
  runtime: Runtime
): void {
  const fontSize = node.fontSize;
  const x = params.x ? parseInt(params.x) : 0;
  let y = (params.y ? parseInt(params.y) : 0) + fontSize;
  // function drawArcText(
  //   ctx: CanvasRenderingContext2D,
  //   text: string,
  //   x: number,
  //   y: number,
  //   radius: number,
  //   startRotation: number,
  //   span: number,
  //   align: string,
  //   letterSpace: number
  // ) {
  //   // console.log(text, x, y, radius, startRotation, span, align, letterSpace);
  //   const measureText = ctx.measureText(text);
  //   const len = text.length;
  //   const width = measureText.width;
  //   const height =
  //     measureText.fontBoundingBoxAscent + measureText.fontBoundingBoxDescent;
  //   const totalRads = width / radius;
  //   ctx.beginPath();
  //   ctx.fillStyle = '#0068e2';

  //   const opacity =
  //     typeof node._opacity == 'string'
  //       ? parseInt(node._opacity) / 100
  //       : typeof node._opacity == 'boolean'
  //       ? Number(node._opacity) / 100
  //       : node._opacity / 100;
  //   ctx.fillStyle =
  //     set16ToRgb(node.color ?? '#ffffff', opacity) ?? 'rgba(255,255,255,1)';
  //   // ctx.fillStyle = node.color;
  //   ctx.save();
  //   ctx.translate(x + radius + height, y + radius + height);
  //   ctx.rotate(((span >= 0 ? startRotation : -startRotation) * Math.PI) / 180);
  //   if (align === 'center') {
  //     ctx.rotate(
  //       span >= 0
  //         ? ((span * Math.PI) / 180 - totalRads) / 2
  //         : Math.PI - ((span * Math.PI) / 180 - totalRads) / 2
  //     );
  //   } else if (align === 'right') {
  //     ctx.rotate((span >= 0 ? 1 : -1) * ((span * Math.PI) / 180 - totalRads));
  //   }

  //   let currentWidth = 0;
  //   for (let i = 0; i < len; i++) {
  //     ctx.save();
  //     const measureText = ctx.measureText(text[i]);
  //     /** 超出范围目前没有定义对齐应该如何处理排版 */
  //     if (
  //       currentWidth + measureText.width >
  //       Math.PI * radius * (Math.abs(span) / 180)
  //     ) {
  //       const pointMeasureText = ctx.measureText('.');
  //       for (let k = 0; k < 3; k++) {
  //         ctx.save();
  //         const r = (currentWidth + pointMeasureText.width / 2) / radius;
  //         currentWidth = currentWidth + pointMeasureText.width;

  //         ctx.rotate(r * (span >= 0 ? 1 : -1));
  //         ctx.fillText(
  //           '.',
  //           -pointMeasureText.width / 2,
  //           span >= 0
  //             ? -radius - pointMeasureText.fontBoundingBoxDescent
  //             : radius + pointMeasureText.fontBoundingBoxAscent
  //         );
  //         ctx.restore();
  //       }
  //     } else {
  //       const r = (currentWidth + measureText.width / 2) / radius;
  //       currentWidth = currentWidth + measureText.width + letterSpace;
  //       ctx.rotate(r * (span >= 0 ? 1 : -1));
  //       ctx.fillText(
  //         text[i],
  //         -measureText.width / 2,
  //         span >= 0
  //           ? -radius - measureText.fontBoundingBoxDescent
  //           : radius + measureText.fontBoundingBoxAscent
  //       );
  //       ctx.restore();
  //     }
  //   }
  //   ctx.restore();
  // }

  function drawVerticalText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    align: string,
    w: number
  ) {
    // 左对齐
    const textArr = text.split('');
    if (align === 'left') {
      ctx.textAlign = 'left';
      textArr.forEach((item, index) => {
        ctx.fillText(item, x, y + index * fontSize);
      });
      ctx.textAlign = 'left';
    } else if (align === 'right') {
      // 右对齐
      ctx.textAlign = 'right';
      textArr.forEach((item, index) => {
        ctx.fillText(item, x + w, y + index * fontSize);
      });
      ctx.textAlign = 'left';
    } else if (align === 'center') {
      // 居中对齐
      ctx.textAlign = 'center';
      textArr.forEach((item, index) => {
        ctx.fillText(item, x + w / 2, y + index * fontSize);
      });
      ctx.textAlign = 'left';
    }
  }
  function set16ToRgb(str: string, opacity: number) {
    const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    if (!reg.test(str)) {
      return;
    }
    let newStr = str.toLowerCase().replace(/\#/g, '');
    const len = newStr.length;
    if (len == 3) {
      let t = '';
      for (let i = 0; i < len; i++) {
        t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1));
      }
      newStr = t;
    }
    const arr = []; //将字符串分隔，两个两个的分隔
    let s = '';
    for (let i = 0; i < 6; i = i + 2) {
      s = newStr.slice(i, i + 2);
      arr.push(parseInt('0x' + s));
    }
    return 'rgba(' + arr.join(',') + ',' + opacity + ')';
  }
  function drawRotationText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    w: number,
    fontSize: any,
    rotation: number,
    align: string
  ) {
    const textHeight = fontSize;
    ctx.save();
    if (align == 'left') {
      ctx.translate(x, y - textHeight);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, 0, textHeight);
    } else if (align == 'center') {
      ctx.translate(x + w / 2, y - textHeight);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, -w / 2, textHeight);
    } else {
      ctx.translate(x + w, y - textHeight);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, -w, textHeight);
    }
    ctx.restore();
  }

  if (node._opacity != undefined) {
    const opacity =
      typeof node._opacity == 'string'
        ? parseInt(node._opacity) / 100
        : typeof node._opacity == 'boolean'
        ? Number(node._opacity) / 100
        : node._opacity / 100;
    ctx.fillStyle =
      set16ToRgb(node.color ?? '#ffffff', opacity) ?? 'rgba(255,255,255,1)';
  } else {
    // 没设置透明度时
    ctx.fillStyle =
      set16ToRgb(node.color ?? '#ffffff', 100) ?? 'rgba(255,255,255,1)';
  }
  if (node.style !== 'arc') {
    ctx.canvas.style.letterSpacing = `${node.letterSpace}px`;
  } else {
    ctx.canvas.style.letterSpacing = `0px`;
  }

  ctx.font = `${node.bold ? 'bold' : ''} ${fontSize}px ${
    node.fontId + '-' + node.fontWeight ?? 'MiSansLatin-Bold'
  }`;

  // const text = useCanvasGenerateText(node, runtime.configData);
  const text = node.string !== '' ? node.string : 'text';
  if (node.style === 'arc') {
    const radius = node.radius;
    y = params.y ? parseInt(params.y) : 0;
    /**绘制基准线，比较位置时使用 */
    // drawArcTextLine(ctx, text, x, y, radius);
    // drawArcText(
    //   ctx,
    //   text,
    //   x,
    //   y,
    //   radius,
    //   node.startAngle,
    //   node.span,
    //   node.align,
    //   node.letterSpace
    // );
  } else if (node.style === 'normal') {
    if (node.rotation) {
      const rotation = node.rotation;
      drawRotationText(ctx, text, x, y, node.w, fontSize, rotation, node.align);
    } else {
      if (node.align == 'left') {
        ctx.fillText(text, x, y);
      } else if (node.align == 'center') {
        ctx.textAlign = 'center';
        ctx.fillText(text, x + node.w / 2, y);
        ctx.textAlign = 'left';
      } else if (node.align == 'right') {
        ctx.textAlign = 'right';
        ctx.fillText(text, x + node.w, y);
        ctx.textAlign = 'left';
      } else {
        ctx.fillText(text, x, y);
      }
    }
  } else if (node.style === 'vertical') {
    drawVerticalText(ctx, text, x, y, fontSize, node.align, node.w);
  }

  ctx.restore();
}
