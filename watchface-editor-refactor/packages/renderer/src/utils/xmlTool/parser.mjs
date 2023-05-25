import { compile } from 'vue-template-compiler';

// 过滤 type
function f(arr) {
  return arr
    .filter((item) => item.type === 1)
    .map((item) => {
      item = Object.assign({}, item);
      if (item.children && item.children.length) {
        item.children = f(item.children);
      }
      return item;
    });
}

// 过滤空text字段
function deleteText(ast) {
  ast.children.forEach((item, index) => {
    if (item.type === 3 && item.text === ' ') {
      ast.children.splice(index, 1);
    }
    if (item.children && item.children.length) {
      deleteText(item);
    }
  });
}

// 删除type字段
function deleteType(ast) {
  ast.children.forEach((item) => {
    delete item.type;
    if (item.children && item.children.length) {
      deleteType(item);
    }
  });
}

// 删除不需要的字段
function deletePrototype(ast) {
  delete ast.parent;
  delete ast.rawAttrsMap;
  delete ast.attrs;
  delete ast.plain;
  delete ast.pre;
  delete ast.ns;
  delete ast.static;
  delete ast.staticRoot;
  delete ast.staticStyle;
  delete ast.attrsList;
  delete ast.ref;
  delete ast.refInFor;
  if (ast.children) {
    ast.children.forEach((item) => {
      deletePrototype(item);
    });
  }
}

function encode(str) {
  // 对字符串进行编码
  const encode = encodeURI(str);
  // 对编码的字符串转化base64
  const base64 = Buffer.from(encode).toString('base64');
  return base64;
}

// 将注释信息转换成标准xml格式
function getAnnotation(str) {
  const regex = /<!--([\s\S]*?)-->/g;
  str = str.replace(regex, (source, value) => {
    return `<Annotation str="${encode(value)}"/>`;
  });
  return str;
}

/**
 * xml解析器
 * 解析xml,生成ast
 * @param {string} code -传入xml字符串
 * @param {object} mconfig -自定义参数
 * @returns {object} - 返回解析后的ast
 */

export default function (str, mconfig) {
  try {
    const config = {
      type3: false, //是否保留type3的数据
      annotation: false //是解析注释的数据
    };
    if (mconfig) Object.assign(config, mconfig);

    // 转换注释
    if (config.annotation) str = getAnnotation(str);

    const ast = compile(str).ast;
    // 删除无用字段
    deletePrototype(ast);
    if (!config.type3) ast.children = f(ast.children);
    else deleteText(ast);
    deleteType(ast);
    delete ast.type;
    return ast;
  } catch (err) {
    return null;
  }
}
