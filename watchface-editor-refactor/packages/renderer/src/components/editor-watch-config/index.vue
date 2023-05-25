<template>
  <div>
    <div
      v-if="!openDrawer"
      class="w-full h-[50px] bg-black flex items-center justify-between pr-5"
    >
      <div class="mx-[20px]">预览区</div>
      <Icon
        icon="arrow-down.svg"
        :width="12"
        :height="12"
        @click="handleOpenDrawer"
      />
    </div>

    <div
      ref="panel"
      v-else
      class="w-full flex flex-col overflow-hidden max-h-[500px] min-h-[150px]"
    >
      <div class="w-full h-[50px] bg-black pr-5 flex-shrink-0">
        <div
          class="w-full h-[10px] hover:cursor-row-resize"
          @mousedown="onMouseDown"
        ></div>
        <div class="w-full h-[40px] flex justify-between items-center">
          <div class="flex">
            <div
              class="mx-[20px] px-3"
              :class="{ ['border-b-2']: selectIndex == 1 }"
              @click="() => changeTab(1)"
            >
              时间日期类
            </div>
            <div
              class="mx-[20px] px-3"
              :class="{ ['border-b-2']: selectIndex == 2 }"
              @click="() => changeTab(2)"
            >
              运动健康类
            </div>
            <div
              class="mx-[20px] px-3"
              :class="{ ['border-b-2']: selectIndex == 3 }"
              @click="() => changeTab(3)"
            >
              工具类
            </div>
          </div>
          <Icon
            icon="arrow-down.svg"
            :width="12"
            :height="12"
            @click="handleOpenDrawer"
          />
        </div>
      </div>
      <div class="w-full h-full bg-black-50 flex-1 overflow-y pb-[50px]">
        <TimeDate v-if="selectIndex == 1" />
        <SportHealth v-else-if="selectIndex == 2" />
        <OtherTool v-else />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { debounce } from 'lodash-es';

const openDrawer = ref(false);
const selectIndex = ref(1);
const emits = defineEmits<{
  (event: 'changePanel', change: boolean): void;
}>();
const handleOpenDrawer = () => {
  openDrawer.value = !openDrawer.value;
  emits('changePanel', openDrawer.value);
};
const changeTab = (index: number) => {
  selectIndex.value = index;
};
const panel = ref<HTMLDivElement>();

const onMouseDown = (e: MouseEvent) => {
  const y0 = e.pageY;
  const h0 = panel.value?.clientHeight ?? 0;
  const move = debounce((e: MouseEvent) => {
    const y = e.pageY;
    const offset = y0 - y;
    if (panel.value) panel.value.style.height = h0 + offset + 'px';
  });
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move);
  });
};
</script>

<style scoped>
div,
span {
  user-select: none;
}
</style>
