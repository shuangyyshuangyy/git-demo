import { FolderService } from '@/services/folder.service';
import { defineStore } from 'pinia';
import { LayerUtils } from '@/utils/layer.util';

export const useLayerStore = defineStore('layer-store', {
  state: () => ({
    themes: [] as Array<StoreThemeItem>
  }),
  getters: {
    findTheme(state) {
      return (id: string): StoreThemeItem | undefined => {
        return state.themes.find((item) => item.id === id);
      };
    },
    findThemeColor(state) {
      return (
        themeStyle: StoreThemeItem,
        id: string
      ): ThemeColor | undefined => {
        for (let j = 0; j < themeStyle.colorGroup.length; j++) {
          const res = themeStyle.colorGroup[j];
          if (res.id == id) return res;
        }
      };
    },

    /**
     * 返回所有normal类型的theme
     * @param state
     * @returns
     */
    normalThemes(state) {
      return state.themes.filter((item) => item.type == 'normal');
    },

    /**
     * 返回所有AOD类型的theme
     * @param state
     * @returns
     */
    AODThemes(state) {
      return state.themes.filter((item) => item.type == 'AOD');
    },

    /**
     * 查找layer
     * @param state
     * @returns
     */
    find(state) {
      return (
        id: string,
        themeId?: string
      ): {
        layer: StoreLayerItem;
        index: number;
        parent: StoreLayerItem | null;
      } | null => {
        let result: {
          layer: StoreLayerItem;
          index: number;
          parent: StoreLayerItem | null;
        } | null = null;
        const dfs = (
          node: StoreLayerItem,
          parent: StoreLayerItem | null,
          index: number | null
        ) => {
          if (node.id === id) {
            result = {
              layer: node,
              index: index ?? 0,
              parent: parent?.id ? parent : null
            };
            return;
          }
          if (node.children) {
            node.children.forEach((child, i) => {
              dfs(child, node, i);
            });
          }
        };

        const _list = themeId
          ? this.findTheme(themeId)?.children ?? []
          : this.themes.map((item) => item.children).flat();
        dfs({ children: _list } as StoreLayerItem, null, null);
        return result;
      };
    },

    /**
     * 查找layer
     * @param state
     * @returns
     */
    findLayer(state) {
      return (
        id: string | ((layer: StoreLayerItem) => boolean)
      ): FindLayerResult | undefined => {
        const stack: FindLayerResult[] = [];
        state.themes.forEach((theme) => {
          theme.children.forEach((layer, index) => {
            stack.push({
              parent: theme,
              layer,
              index
            });
          });
        });

        while (stack.length) {
          const len = stack.length;
          for (let i = 0; i < len; i++) {
            // 弹出最后第一个元素
            const temp = stack.pop();
            if (!temp) continue;
            // 判断是否存在
            if (typeof id == 'function') {
              if (id(temp.layer)) {
                return temp;
              }
            }
            if (id == temp.layer.id) {
              return temp;
            }

            if (temp.layer.children?.length) {
              temp.layer.children.forEach((_layer, index) => {
                stack.unshift({
                  layer: _layer,
                  parent: temp.layer,
                  index
                });
              });
            }
          }
        }
      };
    }
  },
  actions: {
    moveLayer(
      id: string,
      themeId: string,
      parentId?: string,
      destIndex: number = 0
    ) {
      let { layer, index, parent } = this.find(id, themeId) || {};
      if (!layer || index === undefined) {
        console.error(`样式：${themeId} 中找不到图层：${id}`);
        return;
      }
      let targetParent: StoreLayerItem | undefined;
      if (parentId) {
        const target = this.find(parentId, themeId);
        if (!target) {
          console.error(`样式：${themeId} 中找不到父节点：${parentId}`);
          return;
        }
        targetParent = target.layer;
      }

      const theme = this.findTheme(themeId);
      if (parent) {
        layer.attrs.x += parent.attrs.x;
        layer.attrs.y += parent.attrs.y;
        parent.children?.splice(index, 1);
      } else {
        theme?.children.splice(index, 1);
      }

      if (targetParent) {
        layer.attrs.x -= targetParent.attrs.x;
        layer.attrs.y -= targetParent.attrs.y;
        targetParent.children?.splice(destIndex, 0, layer);
      } else {
        theme?.children.splice(destIndex, 0, layer);
      }
      return layer;
    },
    group(
      shapeIds: string[],
      newLayer: StoreLayerItem,
      themeId: string,
      parentId?: string
    ) {
      const theme = this.findTheme(themeId) as StoreThemeItem;
      const parentList = parentId
        ? this.find(parentId, themeId)?.layer.children || []
        : theme?.children;
      const children = shapeIds.map((id) =>
        parentList.find((item) => item.id == id)
      ) as StoreLayerItem[];

      const layerRange = LayerUtils.calcLayersRect(children);
      let first = Infinity;
      children.forEach((layer) => {
        let curIndex = parentList.findIndex((item) => item.id === layer.id);
        const delLayer = parentList.splice(curIndex, 1)[0];
        newLayer.children?.push(delLayer);
        LayerUtils.setRelativeAttrs(delLayer, layerRange);
        first = Math.min(first, curIndex);
      });

      Object.assign(newLayer, layerRange);
      parentList.splice(first, 0, newLayer);
      return newLayer;
    },
    ungroup(id: string, layers: StoreLayerItem[], themeId: string) {
      const theme = this.findTheme(themeId);
      if (!theme) {
        console.warn(`theme: ${themeId} 找不到`);
        return;
      }
      const target = this.find(id, themeId);
      if (!target) return;
      const { layer, index, parent } = target;
      const parentList = parent ? parent.children || [] : theme.children;

      if (layer?.children?.length) {
        parentList.splice(index, 1, ...layers);
      } else {
        parentList.splice(index, 1);
      }
    },

    initStore(themes: StoreThemeItem[]) {
      this.themes = themes ?? ([] as StoreThemeItem[]);
    },

    /**
     * 读取本地json文件到store数据中
     */
    async syncLayerData() {
      const config = await new FolderService().getEditorData();
      this.themes = config || [];
    }
  }
});
