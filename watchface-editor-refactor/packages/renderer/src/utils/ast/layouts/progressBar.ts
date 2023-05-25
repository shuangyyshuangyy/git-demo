import { Shape } from '@/services/shape';
import { ProgressBarAttribute } from '@/services/shape/attributes/progress-bar';
import generateID from '@/utils/generate-id';
import { generateLayoutAst, insertImages } from './_helper';

export const getProgressBarAst = (resourceAst: Ast, shape: Shape) => {
  const attrs = shape.attrs as ProgressBarAttribute;

  // 插入图片:背景图和进度条图片
  const images = insertImages(resourceAst, attrs.resources, ['progress', 'bg']);

  // 添加上图片数字或图片数值对
  const progressBarAst: Ast = {
    tag:
      attrs.type == 'arc'
        ? 'DataItemArcProgressBar'
        : 'DataItemLineProgressBar',
    attrsMap: {
      name: generateID(),
      source: attrs.source ?? '',
      ref: '@' + images[0]?.name ?? '',
      bg: '@' + images[1]?.name ?? ''
    },
    children: []
  };
  // 根据不同类型，添加不同属性
  if (attrs.type == 'arc') {
    progressBarAst.attrsMap['angleStart'] = attrs.angleStart?.toString();
  }
  if (attrs.type == 'line') {
  }

  resourceAst.children.push(progressBarAst);

  // 生成 layout ast
  const layoutAst: Ast = generateLayoutAst(
    '@' + progressBarAst.attrsMap.name,
    attrs.x,
    attrs.y
  );

  return layoutAst;
};
