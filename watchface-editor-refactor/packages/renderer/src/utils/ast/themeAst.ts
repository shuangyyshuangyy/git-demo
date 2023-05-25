import { Shape, ShapeType } from '@/services/shape';
import { getImageAst } from './layouts/image';
import { getImageArrayAst } from './layouts/imageArray';
import { getProgressBarAst } from './layouts/progressBar';
import { getTextAst } from './layouts/text';

export default (resourceAst: Ast, theme: StoreThemeItem) => {
  const themeAst: Ast = {
    tag: 'Theme',
    attrsMap: {
      type: theme.type,
      name: theme.name,
      colorGroupTable: theme.colorGroup.map((item) => item.color).join(',')
    },
    children: []
  };

  // 解析shape
  const shapes = Shape.shapeTree(theme.id);
  shapes.forEach((shape) => {
    const type = shape.type;
    let layoutAst: Ast | Ast[] | undefined;
    switch (type) {
      case ShapeType.Image:
        layoutAst = getImageAst(resourceAst, shape);
        break;
      case ShapeType.ImageArray:
        layoutAst = getImageArrayAst(resourceAst, shape);
        break;
      case ShapeType.ProgressBar:
        layoutAst = getProgressBarAst(resourceAst, shape);
        break;
      case ShapeType.Text:
        layoutAst = getTextAst(resourceAst, shape);
        break;
    }
    if (layoutAst) {
      Array.isArray(layoutAst)
        ? themeAst.children.push(...layoutAst)
        : themeAst.children.push(layoutAst);
    }
  });

  return themeAst;
};
