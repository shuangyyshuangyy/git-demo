/**
 * 简单的xml转json,
 * @param xml
 * @returns
 */
export const xmlToJson = (xml: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const res: Record<string, string> = {};
    doc.children[0].childNodes.forEach((item) => {
      if (item.nodeType == Node.COMMENT_NODE) return;
      if (item.nodeType == Node.TEXT_NODE) return;
      res[item.nodeName] = item.textContent ?? '';
    });
    return res;
  } catch (error) {
    return;
  }
};
