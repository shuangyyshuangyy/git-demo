export default function (runtime: Runtime): void {
  runtime.resources =
    runtime.ast.children.find((item: Ast) => item.tag === 'Resources') ??
    ({} as Ast);

  const themeName = runtime.renderTheme.name;

  // 查找当前name的表盘
  const themes: Ast[] =
    runtime.ast.children.filter(
      (item: Ast) => item.tag === 'Theme' && item.attrsMap.name == themeName
    ) ?? [];

  // 设置normal的表盘
  runtime.normal =
    themes.find((item: Ast) => item.attrsMap.type === 'normal') ?? ({} as Ast);

  // dark状态
  runtime.dark =
    themes.find((item: Ast) => item.attrsMap.type === 'dark') ?? ({} as Ast);

  // AOD状态
  runtime.AOD =
    themes.find((item: Ast) => item.attrsMap.type === 'AOD') ?? ({} as Ast);
}
