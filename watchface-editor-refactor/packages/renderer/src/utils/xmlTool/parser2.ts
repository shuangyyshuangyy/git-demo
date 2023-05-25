export default function (xml: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const _genarate = (node: Element) => {
    const attrsMap: Ast['attrsMap'] = {};
    node.getAttributeNames().forEach((name) => {
      const val = node.getAttribute(name);
      attrsMap[name] = val ?? '';
    });
    const ast: Ast = {
      tag: node.nodeName,
      attrsMap,
      children: []
    };
    ast.children = !node.childElementCount
      ? []
      : Array.from(node.children).map((item) => {
          return _genarate(item);
        });

    return ast;
  };

  const root = doc.children[0];
  const ast = _genarate(root);

  return ast;
}
