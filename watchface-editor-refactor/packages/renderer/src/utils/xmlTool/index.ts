import xmlFormatter from 'xml-formatter';
import { cloneDeep, escape, isEmpty, unescape, update } from 'lodash-es';
import parser from './parser';
import parser2 from './parser2';

interface CompilerConfig {
  escape: boolean;
  compilerUseless: boolean;
}

const config: CompilerConfig = {
  escape: false, // 进行属性转义
  compilerUseless: false // 无效标签编译
};

export function descriptionToXML(
  description: any,
  ignoreKeys: string[] = []
): string {
  let text = '';
  Object.entries(description).forEach(([key, value]) => {
    if (!ignoreKeys.includes(key)) {
      text += `\n	<${key}>${value}</${key}>`;
    }
  });
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<watch>${text}\n</watch>`;
  return xml;
}
// 不参与编译的属性
const notCompilerList = ['__length', '__draw', '_base64', 'imgUrl'];

// 标签属性遍历
function attrsMapper(rawAst: Ast): string {
  let attrsStr = '';
  if (rawAst.attrsMap && Object.keys(rawAst.attrsMap).length > 0) {
    const { attrsMap } = rawAst;
    const attrs = Object.keys(attrsMap);
    attrs.forEach((attr) => {
      if (notCompilerList.indexOf(attr) === -1) {
        // xml特殊字符转义
        if (config.escape) update(attrsMap, attr, (o) => escape(unescape(o)));
        if (attrsMap[attr] !== null && attrsMap[attr] !== undefined) {
          if (
            (attr === 'color' ||
              attr === 'opacity' ||
              attr === 'format' ||
              attr === 'recolorEnable' ||
              attr === 'compressMethod') &&
            rawAst.tag === 'Layout'
          ) {
            // return;
            attrsStr += ` _${attr}="${attrsMap[attr]}"`;
          } else {
            attrsStr += ` ${attr}="${attrsMap[attr]}"`;
          }
        }
      }
    });
  }
  return attrsStr;
}

function decode(base64: string) {
  // 对base64转编码
  const decode = Buffer.from(base64).toString('base64');
  // 编码转字符串
  const str = decodeURI(decode);
  return str;
}

// 行编译
function rowCompiler(rowAstObj: Ast): string {
  let str = '';
  const tag = rowAstObj.tag;
  const hasChildren =
    Array.isArray(rowAstObj.children) && rowAstObj.children.length > 0;
  const rowAstObjIsUseless =
    isEmpty(rowAstObj.attrsMap) && !hasChildren && tag !== 'Resources';
  // <Group/> 这样的标签为认为无效标签，config.compilerUseless 可配置是否编译它
  if (config.compilerUseless || !rowAstObjIsUseless) {
    if (tag === 'Annotation')
      //编译注释
      str += `<!--${decode(rowAstObj.attrsMap.str.toString())}-->`;
    else {
      str += `<${tag}`;
      str += attrsMapper(rowAstObj);
      if (hasChildren) {
        str += '>';
        str += xmlCompiler(rowAstObj.children);
        str += `</${tag}>`;
      } else str += '/>';
    }
  }
  return str;
}

// xml编译
function xmlCompiler(ast: Ast[]) {
  let str = '';
  ast.forEach((item) => {
    str += rowCompiler(item);
  });
  // }
  return str;
}

/**
 * @method 将ast编译成xml
 */
export function astToXml(ast: Ast, xConfig?: CompilerConfig): string {
  if (xConfig) Object.assign(config, xConfig);
  const cloneast = cloneDeep(ast);
  // const Resources = cloneast.children;
  // if (
  //   Resources.length > 0 &&
  //   Resources[0].tag === 'Resources' &&
  //   Resources[0].children.length > 0
  // ) {
  //   const child = Resources[0].children;
  //   child.map(item => {
  //     if (item.tag === 'CustomWidget') {
  //       item.tag = 'Widget';
  //     } else if (item.tag === 'File') {
  //       delete item.attrsMap.recolorEnable;
  //     }
  //   });
  // }
  return xmlFormatter(xmlCompiler([cloneast]));
}

/**
 * 将xml文本转为ast
 * @param xml
 * @returns
 */
export const xmlToAst = (xml: string): Ast => {
  // return parser(xml) ?? ({} as Ast);
  return parser2(xml) ?? ({} as Ast);
};
