import { Shape } from '@/services/shape';
import generateID from '@/utils/generate-id';
import { generateLayoutAst, insertImages } from './_helper';
import { ImageAttribute } from '@/services/shape/attributes/image';

export const getImageAst = (resourceAst: Ast, shape: Shape) => {
  const attrs = shape.attrs as ImageAttribute;

  const { lightPointerType, resources } = attrs;
  // 如果是单图
  if (lightPointerType == 'none') {
    // 添加图片
    const images = insertImages(resourceAst, resources, ['pointer0']);
    // 生成 layout ast
    const layoutAst: Ast = generateLayoutAst(
      '@' + images[0]?.name,
      attrs.x,
      attrs.y
    );

    return layoutAst;
  } else {
    // 指针类型
    // 添加图片
    const images = insertImages(
      resourceAst,
      resources,
      lightPointerType == 'two'
        ? ['pointer0', 'pointer1', 'pointerShadow']
        : ['pointer0', 'pointer1', 'pointer2', 'pointer3', 'pointerShadow']
    );

    const layouts: Ast[] = [];

    images.forEach((image) => {
      const { name, resourceName } = image;
      // 添加上图片数字或图片数值对
      const refAst: Ast = {
        tag: 'DataItemPointer',
        attrsMap: {
          name: generateID(),
          source: attrs.source ?? '',
          ref: '@' + images[0]?.name ?? ''
        },
        children: []
      };

      resourceAst.children.push(refAst);

      // 生成 layout ast
      const layoutAst: Ast = generateLayoutAst(
        '@' + refAst.attrsMap.name,
        attrs.x,
        attrs.y + resourceName == 'pointerShadow'
          ? attrs.shadowPointerOffsetY ?? 0
          : 0
      );

      layouts.push(layoutAst);
    });

    return layouts;
  }
};
