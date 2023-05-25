import { useLayerStore } from '@/store/use-layer-store';
import { useSelectStore } from '@/store/use-select-store';
import { EventType, emitter } from '@/utils/emitter.utils';
import generateID from '@/utils/generate-id';
import { LayerUtils } from '@/utils/layer.util';
import { cloneDeep } from 'lodash-es';
import { ref } from 'vue';

export const useThemeManage = () => {
  const maxCount = ref(5);
  const layerStore = useLayerStore();
  const selectStore = useSelectStore();

  const addNormalTheme = (copyFrom?: StoreThemeItem) => {
    const themeStyles: StoreThemeItem[] = [];
    // 新的样式名称
    let name = copyFrom ? copyFrom.name + ' copy' : '样式1';
    // 确保名称唯一性
    const existsName = layerStore.themes.map((item) => item.name) ?? [];
    name = LayerUtils.uniqueThemeName(existsName, name);

    // 获取新的themeStyles
    const _addThemeStyle = (theme: StoreThemeItem) => {
      const _theme = cloneDeep(theme);
      _theme.id = generateID();
      _theme.name = name;
      // 重置所有layout的id
      _theme.children.forEach((layer) => {
        layer.id = generateID();
      });
      themeStyles.push(_theme);
    };
    if (copyFrom) {
      layerStore.themes
        .filter(
          (theme) => theme.name == copyFrom.name && theme.type == copyFrom.type
        )
        .forEach((theme) => {
          _addThemeStyle(theme);
        });
    } else {
      const _theme = LayerUtils.getEmptyThemeStyle();
      _addThemeStyle(_theme);
    }

    // 最后执行插入操作
    themeStyles.forEach((themeStyle) => {
      layerStore.$state.themes.push(themeStyle);
    });

    selectStore.selectTheme(
      themeStyles.find((item) => item.type == 'normal')?.id ?? ''
    );

    emitter.emit(EventType['theme:create']);
  };

  /**
   * 新增一个AOD模式的样式
   * @param normalTheme 所对应的normal模式
   */
  const addAODTheme = (normalTheme: StoreThemeItem) => {
    if (
      layerStore.themes.find(
        (item) => item.name == normalTheme.name && item.type == 'AOD'
      )
    )
      return;
    const AODTheme = cloneDeep(normalTheme);
    if (!normalTheme) return;

    AODTheme.id = generateID();
    AODTheme.type = 'AOD';
    // 重置所有layerId
    AODTheme.children.forEach((layer) => (layer.id = generateID()));
    layerStore.themes.push(AODTheme);

    emitter.emit(EventType['theme:create']);
  };

  const rename = (themeId: string, newVal: string) => {
    const themeStyle = layerStore.findTheme(themeId);
    const name = themeStyle?.name ?? '';

    layerStore.themes
      .filter((item) => item.name == name)
      .forEach((item) => {
        item.name = newVal;
      });

    emitter.emit(EventType['theme:set-attr']);
  };

  /**
   * 删除一个normal类型的主题，同时需要将AOD类型的删除
   * @param themeId
   * @returns
   */
  const deleteNormalTheme = (themeId: string) => {
    const themeStyle = layerStore.findTheme(themeId);
    if (!themeStyle) return;
    layerStore.themes = layerStore.themes.filter(
      (item) => item.name != themeStyle.name
    );
    selectStore.selectTheme();
    emitter.emit(EventType['theme:delete']);
  };

  /**
   * 验证theme名称是否合法
   * @param treeId
   * @param value
   * @returns { String } err 错误信息或者空字符串
   */
  const validName = (themeId: string, newName: string) => {
    const themes = layerStore.normalThemes.filter(
      (item) => item.id !== themeId
    );
    // 验证是否重名
    if (themes.some((item) => item.name == newName)) {
      return '名称重复，请更换';
    }
    if (!newName.length) return '名称不可为空';
    if (newName.length > 10) return '最多10个字符';
  };

  /**
   * 移动元素
   * @param themeId 要移动的themeId
   * @param after [可选] 要移动到哪个theme后面
   * @returns
   */
  const moveTheme = (themeId: string, afterThemeId?: string) => {
    const _getNewThemeStyles = () => {
      // 先将移动的元素提取出来
      const themeStyle = layerStore.findTheme(themeId);
      const themeStyles = layerStore.normalThemes.filter(
        (item) => item.id !== themeId
      );
      if (!themeStyle) return;

      // 插入新的位置
      if (!afterThemeId) {
        // 移动到顶部
        themeStyles.unshift(themeStyle);
      } else {
        // 移动到afterTheme后面
        const afterTheme = layerStore.findTheme(afterThemeId);
        if (!afterTheme) return;
        const index = themeStyles.findIndex((item) => item.id == afterTheme.id);
        if (index < 0) return;
        themeStyles.splice(index + 1, 0, themeStyle);
      }
      return themeStyles;
    };
    const themeStyles = _getNewThemeStyles();
    if (!themeStyles) return;

    // 重置layerstore中的themes
    const themeStyles2: StoreThemeItem[] = [];
    themeStyles.forEach((item) => {
      const res = layerStore.$state.themes.filter(
        (item2) => item2.name == item.name
      );
      themeStyles2.push(...res);
    });

    layerStore.initStore(themeStyles2);
    emitter.emit(EventType['theme:move']);
  };

  /**
   * 切换息屏方式
   * @param mode
   */
  const exchangeAODMode = (mode: 'single' | 'multi') => {
    // const _createAODTheme
    // 判断当前有几个AOD主题
    const len = layerStore.AODThemes.length;
    if (mode == 'single') {
      // 切换到single时，把第一个息屏保留，其他的删除
      // 第一个主题
      const firstThemeStyle: StoreThemeItem | undefined =
        layerStore.normalThemes[0];
      if (!firstThemeStyle) return;

      // 把第一个息屏保留，其他的删除
      layerStore.themes = layerStore.themes.filter((item) => {
        return item.type == 'normal' || item.name == firstThemeStyle.name;
      });
    }
    if (mode == 'multi') {
      // 为每个normal样式生成一个AOD样式
      layerStore.normalThemes.forEach((theme) => {
        addAODTheme(theme);
      });
    }
  };

  const updateThemeColorAttr = (
    themeStyle: StoreThemeItem,
    themeColorId: string,
    attrs: { color?: string; name?: string }
  ) => {
    const themeColor = layerStore.findThemeColor(themeStyle, themeColorId);
    if (!themeColor) return;
    const { color, name } = attrs;
    if (name) themeColor.name = name;
    if (color) {
      themeColor.color = color;

      // 当color改变时，需要更改其id值
      const _id = themeColor.id;
      themeColor.id = generateID();

      // 如果当前选择时
      if (selectStore.themeColorId == _id)
        selectStore.selectThemeColor(themeColor.id);
    }

    emitter.emit(EventType['theme-color:set-attr']);
  };

  /**
   * 为主题增加theme color
   * @param theme
   */
  const addThemeColor = (themeStyle: StoreThemeItem, copyFrom?: ThemeColor) => {
    const names = themeStyle.colorGroup.map((item) => item.name);

    const themeColor = copyFrom
      ? cloneDeep(copyFrom)
      : {
          id: '',
          name: '',
          color: '#ffffff'
        };
    themeColor.name = LayerUtils.uniqueThemeName(
      names,
      copyFrom ? copyFrom.name + ' copy' : '配色1'
    );
    themeColor.id = generateID();

    themeStyle.colorGroup.push(themeColor);

    emitter.emit(EventType['theme-color:create']);

    // 选择当前新建的
    selectStore.selectThemeColor(themeColor.id);
  };

  const deleteThemeColor = (
    themeStyle: StoreThemeItem,
    themeColorId: string
  ) => {
    themeStyle.colorGroup = themeStyle.colorGroup.filter(
      (item) => item.id !== themeColorId
    );
    emitter.emit(EventType['theme-color:delete']);
    selectStore.selectThemeColor();
  };

  return {
    addNormalTheme,
    addAODTheme,
    rename,
    validName,
    deleteNormalTheme,
    moveTheme,
    exchangeAODMode,
    maxCount,
    updateThemeColorAttr,
    addThemeColor,
    deleteThemeColor
  };
};
