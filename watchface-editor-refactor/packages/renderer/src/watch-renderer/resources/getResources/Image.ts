export default function (node: Ast, runtime: Runtime): void {
  const name = node.attrsMap.name;
  const src = node.attrsMap.src;
  if (runtime.images[src]) {
    runtime.data[`@${name}`] = {
      data: runtime.images[src],
      src,
      type: 'Image',
      recolorEnable: node.attrsMap.recolorEnable,
    };
  }
}
