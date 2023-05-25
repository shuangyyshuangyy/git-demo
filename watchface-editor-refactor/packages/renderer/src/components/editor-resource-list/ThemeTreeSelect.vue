<template>
  <div class="h-[38px] flex items-center justify-center">
    <div
      v-for="(tab, index) in themeTypes"
      :key="index"
      class="px-0"
      :class="{
        'ml-[85px]': index == 1,
        'opacity-30': tab.type !== selectStore.theme?.type
      }"
    >
      <span
        class="font-semibold cursor-pointer"
        @click="() => onClickTab(tab)"
        >{{ tab.title }}</span
      >
      <template v-if="index == 1">
        <a-dropdown
          :trigger="['click']"
          placement="bottom"
          :disabled="selectStore.theme?.type == 'normal'"
        >
          <div class="inline-block cursor-pointer pr-2">
            <icon
              class="ml-1"
              :icon="'arrow-down.svg'"
              :width="12"
              fill="none"
            />
          </div>
          <template #overlay>
            <a-menu class="bg-black max-h-[500px] w-[218px] py-2" theme="dark">
              <a-menu-item
                v-for="item in menus"
                :key="item.mode"
                class="!p-0 !m-0 !text-white"
              >
                <div
                  :class="{
                    'cursor-not-allowed opacity-30 hover:bg-black':
                      item.disabled
                  }"
                  class="_item hover:bg-blue"
                  @click="
                    () =>
                      !item.disabled && !item.selected && selectMode(item.mode)
                  "
                >
                  <div class="w-11 flex items-center justify-center">
                    <icon
                      v-if="item.selected"
                      icon="Check.svg"
                      :width="18"
                      :height="18"
                      fill="none"
                    />
                  </div>
                  <span> {{ item.title }}</span>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </div>
  </div>
  <!-- {{ menus }} -->
</template>

<script setup lang="ts">
import { useThemeManage } from '@/hooks';
import { useLayerStore } from '@/store/use-layer-store';
import { useSelectStore } from '@/store/use-select-store';
import { computed, watch } from 'vue';

const selectStore = useSelectStore();

const { exchangeAODMode, addAODTheme } = useThemeManage();

const layerStore = useLayerStore();

const themeTypes: { type: StoreThemeItem['type']; title: string }[] = [
  {
    type: 'normal',
    title: '亮屏'
  },
  {
    type: 'AOD',
    title: '息屏'
  }
];

const onClickTab = (tab: (typeof themeTypes)[0]) => {
  const type = tab.type;
  if (type == 'AOD') {
    // 新建一个单息屏样式
    if (!AODThemeCount.value) addAODTheme(layerStore.normalThemes[0]);
    // 更新多样式息屏
    if (AODThemeCount.value > 1) exchangeAODMode('multi');
  }
  reSelectThemeIdIfNeed(type);
};

const AODThemeCount = computed(
  () => layerStore.themes.filter((item) => item.type == 'AOD')?.length ?? 0
);

type AODMode = 'single' | 'multi';

const menus = computed(() => {
  const res: {
    mode: AODMode;
    title: string;
    selected: boolean;
    disabled?: boolean;
  }[] = [
    {
      mode: 'single',
      title: '息屏',
      selected: AODThemeCount.value == 1
    },
    {
      mode: 'multi',
      title: '多样式息屏',
      selected: AODThemeCount.value > 1,
      disabled: !(layerStore.normalThemes.length > 1)
    }
  ];
  return res;
});

const selectMode = (mode: AODMode) => {
  exchangeAODMode(mode);
  reSelectThemeIdIfNeed('AOD');
};

const reSelectThemeIdIfNeed = (type: 'normal' | 'AOD') => {
  // 判断当前选择是否为正确的模式
  const theme = layerStore.findTheme(selectStore.themeId);
  if (!theme) return selectStore.selectTheme();
  // 如果type不正确,则选择改theme对应的类型
  if (theme.type !== type) {
    const theme2 = layerStore.themes.find(
      (item) =>
        item.name == theme.name &&
        item.type == (theme.type == 'AOD' ? 'normal' : 'AOD')
    );
    selectStore.selectTheme(theme2?.id);
  }
};
</script>

<style scoped lang="less">
::v-deep(._item) {
  height: 50px;
  width: 218px;
  font-size: 16px;
  display: flex;
  // justify-content: center;
  align-items: center;
}
</style>
