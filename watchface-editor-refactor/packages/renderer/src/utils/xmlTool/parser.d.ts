export default function (
  ast: string,
  config?: {
    escape: boolean;
    compilerUseless: boolean;
    compileAttrType: boolean;
  }
): Ast | null;
