export default function (runtime: Runtime): void {
  // maml运行时resouse解析后的数据
  runtime.data = {};
  // resouse标签
  runtime.resources = {} as Ast;
  // 正常模式的布局
  runtime.normal = {} as Ast;
  // 暗夜模式的布局
  runtime.dark = {} as Ast;
  // 极简模式的布局
  runtime.AOD = {} as Ast;

  // 离屏绘制的图片
  runtime.offscreen = {};
}
