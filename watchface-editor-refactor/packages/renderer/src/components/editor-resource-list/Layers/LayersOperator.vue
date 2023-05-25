<template>
  <div
    ref="layersOperatorRef"
    @click="handleClicked"
    @contextmenu="handleContextmenu"
    tabindex="-1"
    data-layers-node="true"
    @dragstart.stop="handleDragstart"
    @drag.stop="handleDrag"
    @dragend.stop="handleDragend"
  >
    <slot></slot>

    <div
      class="w-full h-[2px] absolute left-0 top-0 overflow-hidden"
      :class="[isDragging ? 'block' : 'hidden']"
      :style="{
        transform: `translateY(${bar.index * layerHeight}px)`
      }"
    >
      <div
        class="h-full bg-white rounded-[1px]"
        :style="{
          transform: `translateX(${15 + bar.level * 24}px`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  findClosest,
  findClosestIndex,
  limitNumber
} from '@/utils/handle-number';

const props = withDefaults(
  defineProps<{
    layerHeight?: number;
    availableLevels?: Set<number>[];
  }>(),
  {
    layerHeight: 48
  }
);

const emit = defineEmits<{
  (event: 'click', positionInfo: LayerOperationInfo, e: MouseEvent): void;
  (event: 'contextmenu', positionInfo: LayerOperationInfo, e: MouseEvent): void;
  (event: 'dragstart', positionInfo: LayerOperationInfo, e: DragEvent): void;
  (event: 'dragend', index: number, level: number): void;
  (event: 'longstay', index: number): void;
}>();

const layersOperatorRef = ref<HTMLElement>();
const bar = reactive({ index: -1, level: 0 });
const isDragging = ref(true);
const layersTop = ref(0);
const layersLeft = ref(0);
const checkLongstay = getCheckLongOccurrence((index: number) => {
  emit('longstay', index);
});

function handleClicked(e: MouseEvent) {
  const info = getPositionInfo(e.pageX, e.pageY);
  if (info.index >= 0) {
    emit('click', info, e);
  }
}

function handleDragstart(e: DragEvent) {
  if (e.dataTransfer) {
    // 防止鼠标经过样式面板时出现小加号图标
    e.dataTransfer.effectAllowed = 'none';
  }

  isDragging.value = true;

  layersTop.value =
    layersOperatorRef.value?.offsetParent?.getBoundingClientRect().top || 0;
  layersLeft.value = e.pageX;

  const info = getPositionInfo(e.pageX, e.pageY);
  if (info.index >= 0) {
    emit('dragstart', info, e);
  }
}

function handleDrag(e: DragEvent) {
  if (
    props.availableLevels &&
    layersOperatorRef.value?.offsetParent &&
    e.pageY
  ) {
    let cursorIndex = limitNumber(
      (e.pageY -
        layersTop.value +
        layersOperatorRef.value.offsetParent?.scrollTop) /
        props.layerHeight,
      0,
      props.availableLevels.length - 1
    );

    const movingIndex = findClosestIndex(
      cursorIndex,
      props.availableLevels,
      (item) => item.size !== 0
    );

    if (movingIndex >= 0) {
      bar.index = movingIndex;
    }
    checkLongstay.occur(movingIndex);

    // 确定当前 level
    bar.level =
      findClosest(limitNumber((e.pageX - layersLeft.value) / 24, 0, Infinity), [
        ...props.availableLevels[bar.index]
      ]) ?? 0;
  }
}

function handleDragend(e: DragEvent) {
  emit('dragend', bar.index, bar.level);
  isDragging.value = false;
  checkLongstay.reset();

  // 防止 dragstart 时闪一下
  bar.index = -1;
}

function handleContextmenu(e: MouseEvent) {
  const info = getPositionInfo(e.pageX, e.pageY);
  if (info.index >= 0) {
    emit('contextmenu', info, e);
  }
}

function getPositionInfo(pageX: number, pageY: number): LayerOperationInfo {
  const result: LayerOperationInfo = {
    offsetX: 0,
    offsetY: 0,
    index: -1
  };
  if (layersOperatorRef.value?.offsetParent) {
    const rectInfo =
      layersOperatorRef.value.offsetParent.getBoundingClientRect();
    const toLayerTop =
      pageY - rectInfo.top + layersOperatorRef.value.offsetParent.scrollTop;
    result.index = Math.floor(toLayerTop / props.layerHeight);
    result.offsetX = pageX - rectInfo.left;
    result.offsetY = toLayerTop % props.layerHeight;
  } else {
    result.index = -1;
  }

  return result;
}

function getCheckLongOccurrence<T>(
  callback: (data: T) => void,
  duration: number = 1000
) {
  let currentData: T | undefined = undefined;
  let start: number = Infinity;

  return {
    occur: (data: T) => {
      if (currentData !== data) {
        currentData = data;
        start = Date.now();
      } else {
        if (Date.now() - start > duration) {
          callback(data);
          currentData = undefined;
          start = Infinity;
        }
      }
    },
    reset: () => {
      currentData = undefined;
      start = Infinity;
    }
  };
}
</script>
