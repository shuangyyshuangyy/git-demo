<template>
  <div
    :class="[
      'flex justify-between items-center w-[280px] h-[50px] bg-black text-base px-4',
      disabled ? 'cursor-not-allowed opacity-75' : 'text-white hover:bg-blue'
    ]"
  >
    <!-- 左侧图标和文本  -->
    <div class="flex items-center">
      <!-- icon -->
      <div v-if="menuItem.icon" class="mr-3 flex">
        <icon :icon="menuItem.icon" :width="14" :height="14" fill="none" />
      </div>
      <!-- title -->
      <span v-if="menuItem.title">{{ menuItem.title }}</span>
    </div>

    <!-- 右侧二级菜单箭头或者快捷键 -->
    <div class="flex items-center">
      <!-- 二级菜单箭头 -->
      <template v-if="menuItem.children?.length">
        <icon icon="arrow-open.svg" :width="12" :height="12" fill="none" />
      </template>
      <!-- hot keys -->
      <template v-else>
        <div
          v-for="icon in getShortcuts(menuItem.shortcuts ?? [])"
          :key="icon"
          class="ml-2 flex items-center"
        >
          <template v-if="icon.includes('.')">
            <icon :icon="icon" :width="14" :height="14" />
          </template>
          <template v-else>
            <span class="text-base">{{ icon }}</span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { KeyboardKey } from '@/hooks';
import { isMac } from '@/utils/platform';
import { PropType } from 'vue';

defineProps({
  menuItem: {
    type: Object as PropType<DropDownMenuItem>,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const getShortcuts = (shortcuts: KeyboardKey[]) => {
  return shortcuts.map((key) => {
    let shortcut = key as string;
    const isDarwin = isMac();
    switch (key) {
      case 'CommandOrControl':
        shortcut = isDarwin ? 'meta-mac.svg' : 'Ctrl';
        break;
      case 'Shift':
        shortcut = 'arrow-top-outline.svg';
        break;
      case 'Control':
        shortcut = isDarwin ? 'align-control.svg' : 'Ctrl';
        break;
      case 'ArrowLeft':
        shortcut = 'arrow-left.svg';
        break;
      case 'ArrowRight':
        shortcut = 'arrow-right.svg';
        break;
      case 'ArrowUp':
        shortcut = 'arrow-top.svg';
        break;
      case 'ArrowDown':
        shortcut = 'arrow-down.svg';
        break;

      default:
        break;
    }

    return shortcut;
  });
};
</script>

<style scoped>
._hot_keys {
  display: grid;
  grid-template-columns: repeat(fill-auto, auto);
  column-gap: 20px;
}
</style>
