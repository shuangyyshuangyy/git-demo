<template>
  <div class="flex items-center bg-black-50 relative">
    <template
      v-for="color in selectStore.theme?.colorGroup ?? []"
      :key="color.id"
    >
      <drop-down
        :menus="getRightMenus(color as ThemeColor)"
        trigger="contextmenu"
      >
        <tree-title
          class="h-10 text-[12px] text-white font-semibold px-2 min-w-[64px]"
          :class="{
            'bg-[#515151]': color.id == selectStore.themeColorId
          }"
          :tree-id="color.id"
          :title="color.name"
          center
          :submit="(id:string, val:string) => selectStore.theme && updateThemeColorAttr(selectStore.theme, id, { name: val })"
          :editKey="editKeyMap[color.id]"
          tabindex="-1"
          data-tab-node="true"
          @click="() => selectStore.selectThemeColor(color.id)"
        />
      </drop-down>
    </template>

    <div
      class="text-xl font-light mt-[-5px] w-7 h-7 text-center ml-1"
      title="新建配色"
    >
      <a-tooltip title="新建配色">
        <icon :icon="'add.svg'" :width="12" @click="add" />
      </a-tooltip>
    </div>

    <div v-if="isDev" class="absolute right-0">SNAPSHOT: {{ history }}</div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalShortcuts, useThemeManage } from '@/hooks';
import { useSnapshot } from '@/hooks/use-snapshot';
import { useSelectStore } from '@/store/use-select-store';
import { reactive } from 'vue';

const { history } = useSnapshot();
const isDev = import.meta.env.DEV;

const selectStore = useSelectStore();
const { addThemeColor, deleteThemeColor, updateThemeColorAttr } =
  useThemeManage();

const editKeyMap = reactive<Record<string, number>>({});

const getRightMenus = (item: ThemeColor) => {
  const res: DropDownMenuItem[] = [
    {
      title: '复制',
      shortcuts: ['CommandOrControl', 'C'],
      onClick() {
        if (selectStore.theme) addThemeColor(selectStore.theme, item);
      }
    },
    {
      title: '重命名',
      shortcuts: ['CommandOrControl', 'R'],
      onClick() {
        editKeyMap[item.id] = Math.random();
      }
    },
    {
      title: '删除',
      disabled: selectStore.theme?.colorGroup?.[0].id == item.id,
      onClick() {
        if (selectStore.theme) deleteThemeColor(selectStore.theme, item.id);
      }
    }
  ];
  return res;
};

useGlobalShortcuts(
  [
    {
      keyboardKeys: ['CommandOrControl', 'R'],
      handler: () => {
        console.log('重命名');
        if (selectStore.themeColor)
          editKeyMap[selectStore.themeColor.id] = Math.random();
      }
    },
    {
      keyboardKeys: ['CommandOrControl', 'C'],
      handler: () => {
        if (selectStore.themeColor && selectStore.theme)
          addThemeColor(selectStore.theme, selectStore.themeColor);
      }
    }
  ],
  (e: KeyboardEvent) => {
    const targert = e.target as HTMLDivElement;
    return selectStore.theme?.type == 'normal' && !!targert.dataset?.tabNode;
  }
);

const add = () => {
  if (selectStore.theme) addThemeColor(selectStore.theme);
};
</script>

<style scoped></style>
