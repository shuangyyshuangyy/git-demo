import { useLayerStore } from '@/store/use-layer-store';
import getRootAst from './rootAst';
import getThemeAst from './themeAst';
import { astToXml } from '../xmlTool';

export const buildAst = () => {
  const root = getRootAst();
  if (!root) return;

  const resourceAst = root.children[0];

  const layerStore = useLayerStore();
  const themes = layerStore.themes as StoreThemeItem[];
  themes.forEach((theme) => {
    const themeAst = getThemeAst(resourceAst, theme);
    root.children.push(themeAst);
  });

  // if (import.meta.env.DEV) console.log(astToXml(root));

  return root;
};
