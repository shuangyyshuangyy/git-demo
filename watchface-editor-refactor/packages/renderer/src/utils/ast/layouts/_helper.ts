import { Shape } from '@/services/shape';
import generateID from '@/utils/generate-id';

/**
 * 插入图片，返回每个图片对应的名称，当resourceName为images时，当做图组，其余情况当做单图
 * @param resourceAst
 * @param resources
 * @param resourceNames
 * @returns
 */
export const insertImages = (
  resourceAst: Ast,
  resources: Shape['attrs']['resources'],
  resourceNames: string[]
) => {
  const exists = (resourceName: string) => {
    return Object.entries(resources?.[resourceName] ?? {}).some((item) => {
      const [colorGroup, srcArr] = item;
      return !!colorGroup && !!srcArr?.length;
    });
  };
  const images: { name: string; resourceName: string }[] = [];
  resourceNames.forEach((resourceName) => {
    if (exists(resourceName)) {
      images.push({
        name: generateID(),
        resourceName
      });
    }
  });

  images.forEach((item) => {
    const { name, resourceName } = item;
    Object.entries(resources?.[resourceName] ?? {}).forEach((item) => {
      const [colorGroup, srcArr] = item;
      if (resourceName == 'images') {
        const ast: Ast = {
          tag: 'ImageArray',
          attrsMap: {
            name: name,
            colorGroup
          },
          children: srcArr.map((item) => ({
            tag: 'Image',
            attrsMap: {
              src: item
            },
            children: []
          }))
        };
        resourceAst.children.push(ast);
      } else {
        const ast: Ast = {
          tag: 'Image',
          attrsMap: {
            name: name,
            colorGroup,
            src: srcArr?.[0]
          },
          children: []
        };
        resourceAst.children.push(ast);
      }
    });
  });

  return images;
};

export const generateLayoutAst = (ref: string, x: number, y: number) => {
  const layoutAst: Ast = {
    tag: 'Layout',
    attrsMap: {
      ref: ref,
      x: x + '',
      y: y + ''
    },
    children: []
  };
  return layoutAst;
};
