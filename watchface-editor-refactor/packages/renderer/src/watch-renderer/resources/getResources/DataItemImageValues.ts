export default function (node: Ast, runtime: Runtime): void {
  const name = node.attrsMap.name;
  const source = node.attrsMap.source;
  const ref = node.attrsMap.ref;
  const rotation = parseInt(node.attrsMap.rotation) ?? 0;
  runtime.data[`@${name}`] = {
    data: [],
    source,
    ref,
    rotation,
    type: 'DataItemImageValues'
  };
  node.children.forEach((item, i) => {
    const index = item.attrsMap.index ? parseInt(item.attrsMap.index) : i;
    const value = item.attrsMap.value ? parseInt(item.attrsMap.value) : 0;
    const offsetX = item.attrsMap.offsetX ? parseInt(item.attrsMap.offsetX) : 0;
    const offsetY = item.attrsMap.offsetY ? parseInt(item.attrsMap.offsetY) : 0;
    runtime.data[`@${name}`].data[index] = { value, index, offsetX, offsetY };
  });
}
