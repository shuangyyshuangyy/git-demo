import { cloneDeep } from 'lodash-es';
import initData from './utils/initData';
import resources from './resources';
import layout from './layout';
// import xmlParser from '@mi/theme-xml-parser';

/**
 * @method watch渲染实例
 */
export default class {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  autoTick: boolean;
  width: number;
  height: number;
  runtime: Runtime;
  private timeoutTimer: number;
  constructor(canvas: HTMLCanvasElement, config: WatchRenderConfig) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.runtime = cloneDeep(initData);
    this.timeoutTimer = 0;
    this.autoTick = true;
    if (config) this.reset(config);
    this.width = this.canvas.width ? this.canvas.width : 368;
    this.height = this.canvas.height ? this.canvas.height : 448;
    this.runtime.ctx = this.ctx;
    this.runtime.canvas = this.canvas;
  }

  // 重置maml实例
  reset(data: WatchRenderConfig): void {
    for (const key in data) {
      switch (key) {
        case 'ast':
          this.runtime.ast = cloneDeep(data.ast as Ast);
          break;
        case 'images':
          this.runtime.images = data.images;
          break;
        case 'renderTheme':
          this.runtime.renderTheme = {
            ...data.renderTheme
          };
          break;

        case 'tick':
          this.autoTick = data.tick as boolean;
          break;
        case 'config':
          Object.assign(this.runtime.configData, data.config);
          break;
        default:
          break;
      }
    }

    // 获取资源数据
    resources(this.runtime);
  }

  render = (): void => {
    this.cleanCanvas();

    layout(
      this.runtime[this.runtime.renderTheme.type ?? 'normal'],
      this.runtime,
      this.ctx as CanvasRenderingContext2D
    );
  };

  /**
   * @method 刷新画面
   */
  tick = (): void => {
    this.render();
    if (this.autoTick) this.timeoutTimer = requestAnimationFrame(this.tick);
  };

  delImage(key: string): void {
    delete this.runtime.images[key];
  }

  getSize(
    name: string
  ): { x: number; y: number; width: number; height: number } | undefined {
    return this.runtime.size[name];
  }

  // 清空画布
  cleanCanvas(): void {
    this.canvas.width = this.width;
  }
}
