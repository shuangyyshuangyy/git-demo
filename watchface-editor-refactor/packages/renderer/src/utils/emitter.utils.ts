/* eslint-disable @typescript-eslint/no-explicit-any */
export type Handler = (params?: any) => void;

export enum EventType {
  'maml:rendered' = 1,

  /**
   * 完全打开表盘数据
   */
  'watchface:opened',
  'watchface:description-loaded',
  // watchface：修改数据
  'watchface:description-update',
  'watchface:preview-update',
  'watchface:saved',

  // 图层相关
  'shape:create',
  'shape:delete-before',
  'shape:deleted',
  'shape:moved',
  'shape:set-attr',
  'shape:convert',
  'shape:widgeted',
  'shape:unwidgeted',
  'shape:sloted',
  'shape:unsloted',

  // theme相关
  'theme:selected',
  'theme:create',
  'theme:delete',
  'theme:move',
  /**
   * 修改name 配色等属性
   */
  'theme:set-attr',

  'theme-color:selected',
  'theme-color:create',
  'theme-color:delete',
  'theme-color:set-attr',

  'undo-redo',

  // focus
  'window:foucs',
  'window:blur'
}
class Emitter {
  private listeners: Map<EventType, Set<[Handler, boolean]>> = new Map();

  on(type: EventType | EventType[], handler: Handler) {
    const _types = typeof type == 'object' ? [...type] : [type];
    _types.forEach((_type) => {
      if (!this.listeners.has(_type)) this.listeners.set(_type, new Set());
      this.listeners.get(_type)?.add([handler, false]);
    });
  }

  clear() {
    this.listeners = new Map();
  }

  once(type: EventType, handler: Handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)?.add([handler, true]);
  }

  off(type: EventType | EventType[], handler: Handler) {
    const _types = typeof type == 'object' ? [...type] : [type];

    _types.forEach((_type) => {
      const _set = this.listeners.get(_type);
      if (!_type) return;

      _set?.forEach((val) => {
        const [handler0] = val;
        if (handler0 == handler) _set.delete(val);
      });
    });
  }

  emit(type: EventType, params?: any) {
    const _set = this.listeners.get(type);
    if (!type) return;
    _set?.forEach((val) => {
      const [handler, once] = val;
      try {
        handler?.(params);
      } catch (error) {
        console.log(error);
      } finally {
        if (once) _set.delete(val);
      }
    });
  }
}

export const emitter = new Emitter();
