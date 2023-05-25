<template>
  <div class="">
    <EditorTopTools class="h-20" />
    <div class="flex w-full h-[calc(100vh-128px)]">
      <!-- 左侧面板 -->
      <div
        ref="leftPanel"
        class="w-[320px] flex-shrink-0 overflow-auto relative"
      >
        <EditorResourceList />
        <ColumnResizer
          class="right-0 top-0"
          :divEl="leftPanel"
          :min="320"
          :max="500"
        />
      </div>

      <!-- 中间区域 -->
      <div class="w-full relative flex-1 overflow-hidden flex-shrink-0">
        <theme-color-tabs />
        <div
          class="relative overflow-auto w-full h-[calc(100vh-168px-50px)] bg-[#515151]"
        >
          <EditorWatchCanvas />
        </div>
        <div class="absolute left-0 bottom-0 w-full">
          <EditorWatchConfig
            @change-panel="(show:boolean) => onChangePanel(show)"
          />
        </div>
      </div>

      <!-- 右侧面板 -->
      <div
        ref="rightPanel"
        class="w-[320px] flex-shrink-0 overflow-auto relative"
      >
        <!-- 如果已选择元素，则显示元素属性 -->
        <template v-if="selectStore.selectedIds.length">
          <!-- 增加key确保撤销恢复时属性面板数据更新 -->
          <EditorResourceAttr class="" :key="snapshotKey" />
        </template>

        <!-- 未选择元素时，显示配色设置页 -->
        <template v-else>
          <theme-color-config />
        </template>

        <ColumnResizer
          class="left-0 top-0"
          right
          :divEl="rightPanel"
          :min="320"
          :max="500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorInit, useEditorShortcutsSnapshot } from '@/hooks';
import { useSelectStore } from '@/store/use-select-store';
import { ref } from 'vue';
const selectStore = useSelectStore();

// 初始化表盘数据
useEditorInit();
// 全局快捷键和撤销恢复
const { snapshotKey } = useEditorShortcutsSnapshot();

const sizePanelExpand = ref(false);

const onChangePanel = (show: boolean) => {
  sizePanelExpand.value = show;
};
const leftPanel = ref<HTMLDivElement>();
const rightPanel = ref<HTMLDivElement>();
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.panel_config {
  // max-height: 250px;
  overflow: auto;
}
.panel_canvas {
  // max-height: calc(100vh - 170px- 250px);
  overflow: auto;
  // &.panel_canvas_claose {
  //   // max-height: calc(100vh - 170px- 50px);
  // }
}
.panel_canvas::-webkit-scrollbar {
  display: none;
}
</style>
