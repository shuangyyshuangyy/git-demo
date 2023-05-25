<template>
  <div class="bg-black-50 h-full border border-black-border p-4">
    <div class="">配置</div>
    <div class="h-[1px] mt-4 bg-black-border" />
    <!-- 主题色配置 -->
    <div class="py-4">
      <div class="text-white font-normal">
        {{ selectStore.themeColor?.name }}主题色
      </div>
      <div class="mt-3 flex items-center">
        <a-input
          class="p-0 w-9 border-none outline-none"
          v-model:value="color"
          type="color"
          @input="onChange"
        />
        <span class="text-lg text-white ml-2">
          {{ color }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeManage } from '@/hooks';
import { useSelectStore } from '@/store/use-select-store';
import { ref, watch } from 'vue';

const { updateThemeColorAttr } = useThemeManage();

const selectStore = useSelectStore();
const color = ref<string>();
watch(
  () => selectStore.themeColor,
  () => {
    color.value = selectStore.themeColor?.color ?? '#ffffff';
  },
  {
    immediate: true,
    deep: true
  }
);

const onChange = (e: InputEvent) => {
  const val = (e.target as HTMLInputElement)?.value;
  if (!val || !selectStore.themeColor || !selectStore.theme) return;
  updateThemeColorAttr(selectStore.theme, selectStore.themeColor.id ?? '', {
    color: val
  });
};
</script>

<style scoped></style>
