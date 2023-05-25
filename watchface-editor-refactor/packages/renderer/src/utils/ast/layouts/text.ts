import { Shape } from '@/services/shape';
import generateID from '@/utils/generate-id';
import { generateLayoutAst } from './_helper';
import { TextAttribute } from '@/services/shape/attributes/text';

export const getTextAst = (resourceAst: Ast, shape: Shape) => {
  const attrs = shape.attrs as TextAttribute;

  // 添加上图片数字或图片数值对
  const refAst: Ast = {
    tag: 'DataItemText',
    attrsMap: {
      name: generateID(),
      source: attrs.source ?? ''
    },
    children: []
  };

  Object.keys(attrs).forEach((key) => {
    const _key = key as keyof TextAttribute;
    refAst.attrsMap[key] = attrs[_key]?.toString() ?? '';
  });

  resourceAst.children.push(refAst);

  // 生成 layout ast
  const layoutAst: Ast = generateLayoutAst(
    '@' + refAst.attrsMap.name,
    attrs.x,
    attrs.y
  );

  return layoutAst;
};
