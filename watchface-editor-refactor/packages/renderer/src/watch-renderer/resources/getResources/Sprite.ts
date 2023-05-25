export default function (node: Ast, runtime: Runtime): void {
  const name = node.attrsMap.name;
  const ref = node.attrsMap.ref;
  const interval = node.attrsMap.interval
    ? parseInt(node.attrsMap.interval)
    : 10;
  const repeatCount = node.attrsMap.repeatCount
    ? parseInt(node.attrsMap.repeatCount)
    : 0;
  runtime.data[`@${name}`] = { ref, type: 'Sprite', interval, repeatCount };
}
