interface WatchRenderConfig {
  ast?: Ast;
  images?: RuntimeImages;
  tick?: boolean;
  config?: {
    [key: string]: number;
  };

  /**
   * 要渲染的主题
   */
  renderTheme: Runtime['renderTheme'];
}

interface CustomPrams {
  [key: string]: string | number;
}

interface MamlAttrsMap {
  [key: string]: string;
}

interface RuntimeImages {
  [key: string]: HTMLImageElement;
}

interface CanvasPrams {
  type: string; //类型
  img: any; //img图片
}
