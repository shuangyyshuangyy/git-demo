export default function (node: Ast, runtime: Runtime, type: string): void {
  const name = node.attrsMap.name;
  const option = getParams(node);
  const params = { type, ...option, data: [] };
  if (node.children && node.children.length) {
    node.children.forEach((item) => {
      const option = getParams(item);
      (params.data as DataOption[]).push(option);
    });
  }
  runtime.data[`@${name}`] = params;
}
interface DataOption {
  [key: string]: string | number | boolean;
}
function getParams(node: Ast) {
  const obj: DataOption = {};
  for (const key in node.attrsMap) {
    if (!isNaN(parseInt(node.attrsMap[key]))) {
      obj[key] = parseInt(node.attrsMap[key]);
    } else if (node.attrsMap[key] === 'true') {
      obj[key] = true;
    } else if (node.attrsMap[key] === 'false') {
      obj[key] = false;
    } else {
      obj[key] = node.attrsMap[key];
    }
  }
  return obj;
}
