import { Shape } from '@/services/shape';
import { ImageArrayAttribute } from '@/services/shape/attributes/image-array';
import generateID from '@/utils/generate-id';
import { generateLayoutAst, insertImages } from './_helper';

export const getImageArrayAst = (resourceAst: Ast, shape: Shape) => {
  const attrs = shape.attrs as ImageArrayAttribute;

  // 添加图片
  const images = insertImages(resourceAst, attrs.resources, [
    'images',
    'unitIcon'
  ]);

  // 添加上图片数字或图片数值对
  const refAst: Ast = {
    tag:
      attrs.fillType == '普通填充'
        ? 'DataItemImageValues'
        : 'DataItemImageNumber',
    attrsMap: {
      name: generateID(),
      source: attrs.source ?? '',
      ref: '@' + images[0]?.name ?? ''
    },
    children: []
  };
  // 如果是图片数字
  if (attrs.fillType == '数字填充') {
    // 添加单位
    refAst.attrsMap['unitIcon'] = '@' + images[1]?.name;
    // TODO
    // 其他属性
  }
  resourceAst.children.push(refAst);

  // 生成 layout ast
  const layoutAst: Ast = generateLayoutAst(
    '@' + refAst.attrsMap.name,
    attrs.x,
    attrs.y
  );

  return layoutAst;
};
