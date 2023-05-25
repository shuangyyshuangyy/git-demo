export default function (node: Ast, runtime: Runtime): void {
  const name = node.attrsMap.name;
  runtime.data[`@${name}`] = { data: [], type: 'ImageArray' };
  node.children.forEach((item) => {
    const src = item.attrsMap.src;
    if (runtime.images[src]) {
      runtime.data[`@${name}`].data.push({
        data: runtime.images[src],
        src,
        type: 'Image',
        recolorEnable: item.attrsMap.recolorEnable
      });
    }
  });
}
