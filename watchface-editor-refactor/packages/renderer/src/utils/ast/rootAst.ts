import { useLayerStore } from '@/store/use-layer-store';
import { useWatchfaceStore } from '@/store/use-watchface-store';

const _getColorGroupTable = () => {
  const layerStore = useLayerStore();
  const colorGroupTable: string[] = [];
  layerStore.themes.forEach((theme) => {
    theme.colorGroup.forEach((item) => {
      if (!colorGroupTable.includes(item.color))
        colorGroupTable.push(item.color);
    });
  });
  return colorGroupTable.join(',');
};

/**
 * 获取当前表盘root ast数据，返回的结构如下(xml形式)
 * ```
 * <Watchface name="name" width="466" height="466" SKU="false"  colorGroupTable="#ffffff">
    <Resources/>
   </Watchface>
 * ```
 * @returns
 */
export default () => {
  const watchfaceStore = useWatchfaceStore();
  const description = watchfaceStore.description;
  if (!description) return;

  const widthAndHeight = description.size.split('x');

  const rootAst: Ast = {
    tag: 'Watchface',
    attrsMap: {
      name: description.name,
      width: widthAndHeight[0],
      height: widthAndHeight[1],
      SKU: 'false',
      colorGroupTable: _getColorGroupTable()
    },
    children: [{ tag: 'Resources', attrsMap: {}, children: [] }]
  };
  if (description.imageCompression) {
    if (description.deviceType === 'L67') {
      if (description.id) rootAst.attrsMap.id = description.id;
      rootAst.attrsMap.compressMethod = 'RLE';
    } else {
      if (description.id) rootAst.attrsMap.id = description.id;
      rootAst.attrsMap.compressMethod = 'RLEReversed';
    }
  } else {
    if (description.description) rootAst.attrsMap.id = description.description;
  }

  return rootAst;
};
