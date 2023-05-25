interface DataOption {
  [key: string]: string | number | boolean;
}

export default function (node: Ast, runtime: Runtime, type: string): void {
  const name = node.attrsMap.name;
  const option: DataOption = { type };
  for (const key in node.attrsMap) {
    if (!isNaN(parseInt(node.attrsMap[key])) && key !== 'string') {
      option[key] = parseInt(node.attrsMap[key]);
    } else if (node.attrsMap[key] === 'true') {
      option[key] = true;
    } else if (node.attrsMap[key] === 'false') {
      option[key] = false;
    } else {
      option[key] = node.attrsMap[key];
    }
  }
  runtime.data[`@${name}`] = option;
}
