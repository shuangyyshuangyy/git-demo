import { useLayerStore } from '@/store/use-layer-store';
import { emitter, EventType } from '@/utils/emitter.utils';
import { CustomPluginAttribute } from './custom-plugin';
import { TextAttribute } from './text';
import { SlotAttribute } from './slot';
import { WidgetAttribute } from './widget';
import { ImageArrayAttribute } from './image-array';
import { cloneDeep } from 'lodash-es';
import { useImagesStore } from '@/store/use-images-store';
import { getImageSize } from '@/utils/fs/image.utils';
import { ImageAttribute } from './image';
import { ProgressBarAttribute } from './progress-bar';

export type Attributes = CustomPluginAttribute &
  TextAttribute &
  SlotAttribute &
  WidgetAttribute &
  ProgressBarAttribute &
  ImageAttribute &
  ImageArrayAttribute &
  WidgetAttribute &
  SlotAttribute;

export default class ShapeAttribute {
  declare id: string;

  attrs: Partial<Attributes> = {};

  /**
   * 修改普通类型数据（不包括 images unitIcon等图片类型）
   * @param data
   */
  setAttrs(data: Partial<Omit<Attributes, 'resources'>>) {
    const { layer } = useLayerStore().find(this.id) ?? {};
    if (layer) {
      layer.attrs = cloneDeep({
        ...layer?.attrs,
        ...data
      });
    }

    this.initAttrs(true);
  }

  /**
   * 获取资源数据
   * @param resourceName 资源名称
   * @param colorGroup 所属颜色
   * @param base64 [可选] 是否返回base64格式
   * @returns
   */
  getResources(data: {
    resourceName: string;
    colorGroup: string;
    base64?: boolean;
  }) {
    const res =
      this.attrs.resources?.[data.resourceName]?.[data.colorGroup] ?? [];
    const imageStore = useImagesStore();
    return data.base64
      ? res.map((item) => imageStore.image(item)?.value ?? '')
      : res;
  }

  /**
   * 修改资源,
   * @param {Boolean} setSize [可选]是否将图片的宽度和高度赋值给shape的宽度和高度
   */
  async setResources(
    data: {
      resourceName: string;
      colorGroup: string;
      /**
       * 图片真实目录名
       */
      realpath: string;
      /**
       * 图片在数组中index
       */
      index?: number;
    },
    setSize?: boolean
  ) {
    const { layer } = useLayerStore().find(this.id) ?? {};
    if (!layer) return;

    const { resourceName, colorGroup, realpath, index } = data;

    // 添加图片到store
    const imageStore = useImagesStore();
    const _realpaths: string[] = this.getResources({
      resourceName,
      colorGroup
    });
    const { basename, value } = (await imageStore.addImage(realpath)) ?? {};
    if (!basename || !value) return;

    if (index !== undefined) {
      _realpaths[index] = basename;
    } else {
      _realpaths.length = 0;
      _realpaths.push(basename);
    }

    // 根据图片大小，修改shape的大小
    if (setSize) {
      const { width, height } = (await getImageSize(realpath, value)) ?? {};
      this.setAttrs({ w: width ?? 0, h: height ?? 0 });
    }

    if (!layer.attrs.resources) layer.attrs.resources = {};
    if (!layer.attrs.resources?.[resourceName])
      layer.attrs.resources[resourceName] = {};

    layer.attrs.resources[resourceName][colorGroup] = _realpaths;

    this.initAttrs(true);
  }

  /**
   * 删除资源，如未提供resourceName，则删除全部；如未提供colorGroup，则删除resourceName所有资源
   * @param resourceName 【可选】
   * @param colorGroup 【可选】
   */
  deleteResource(data: { resourceName?: string; colorGroup?: string }) {
    const { layer } = useLayerStore().find(this.id) ?? {};
    if (!layer) return;

    const { resourceName, colorGroup } = data;
    if (!resourceName) {
      layer.attrs.resources = {};
    } else {
      if (!colorGroup) {
        const resources = layer.attrs?.resources ?? {};
        delete resources[resourceName];
        layer.attrs.resources = resources;
      } else {
        const colorGroupObj = layer.attrs?.resources?.[resourceName] ?? {};
        delete colorGroupObj[colorGroup];
        if (layer.attrs?.resources?.[resourceName]) {
          layer.attrs.resources[resourceName] = colorGroupObj;
        }
      }
    }

    this.initAttrs(true);
  }

  protected initAttrs(emit = false) {
    const { layer } = useLayerStore().findLayer(this.id) ?? {};
    this.attrs = {
      ...this.attrs,
      ...layer?.attrs
    };

    if (emit)
      emitter.emit(EventType['shape:set-attr'], {
        shapeId: this.id
      });
  }
}
