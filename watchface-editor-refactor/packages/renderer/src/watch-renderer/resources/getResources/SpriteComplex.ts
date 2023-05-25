export default function (node: Ast, runtime: Runtime): void {
  const name = node.attrsMap.name;
  const ref = node.attrsMap.ref;
  const repeatCount = node.attrsMap.repeatCount
    ? parseInt(node.attrsMap.repeatCount)
    : 0;
  runtime.data[`@${name}`] = {
    ref,
    type: 'SpriteComplex',
    repeatCount,
    data: []
  };
  node.children.forEach((item, i) => {
    const interval = item.attrsMap.interval
      ? parseInt(item.attrsMap.interval)
      : 10;
    const offsetX = item.attrsMap.offsetX ? parseInt(item.attrsMap.offsetX) : 0;
    const offsetY = item.attrsMap.offsetX ? parseInt(item.attrsMap.offsetY) : 0;
    const index = item.attrsMap.index ? parseInt(item.attrsMap.index) : i;
    runtime.data[`@${name}`].data.push({ interval, offsetX, offsetY, index });
  });
}
