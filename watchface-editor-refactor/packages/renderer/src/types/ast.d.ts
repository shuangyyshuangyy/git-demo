interface Ast {
  tag: string;
  attrsMap: Record<string, string>;
  children: Ast[];
}

interface FindNodeResult {
  node: Ast;
  parent: Ast;
  index: number;
}
