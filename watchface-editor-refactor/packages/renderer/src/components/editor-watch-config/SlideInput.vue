<template>
  <div class="w-full px-[20px] py-[10px] flex-col">
    <!-- <div class="flex flex-end">
      <input
        :value="initValue"
        @change-value="setValue"
        class="bg-black-50 border"
      />
    </div> -->
    <div>{{ curValue }}</div>
    <div class="flex">
      <div>{{ initValue }}</div>
      <div class="flex-1"></div>
      <div>{{ maxValue }}</div>
    </div>
    <div class="py-[10px]">
      <div ref="progressRef" class="w-full h-[5px] bg-[#EBEBEB] relative" @click="clickHandler">
        <div
          class="h-full bg-red-700"
          :style="{
            width: Math.min(curValue, 100) + '%'
          }"
          
        ></div>
        <div
          class="absolute w-[12px] h-[12px] -top-[4px] rounded-full bg-[#EBEBEB] cursor-pointer"
          :style="{
            left: Math.min(pointer, 100) + '%'
          }"
          @mousedown.stop="mouseHandler"
          @click.prevent
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref, watchEffect } from 'vue';
const props = defineProps({
  initValue: {
    type: Number,
    default: 0
  },
  maxValue: {
    type: Number,
    default: 100
  },
  currentValue: {
    type: Number,
    default: 0
  }
});
const curValue = ref<number>(0);
const pointer = ref<number>(0);
const sliderRef = ref<HTMLDivElement>();
const progressRef = ref<HTMLDivElement>();

onMounted(() => {
  nextTick(() => {
    setValue(props.currentValue);
  });
});

const mouseHandler = (e: MouseEvent) => {
  const event = e || window.event;
  const el = event.target as HTMLDivElement;
  const w = Number(progressRef.value?.getBoundingClientRect().width) || 100;
  const originX = event.clientX;
  const initPercent = curValue.value;
  function moveAt(clientX: number) {
    const dx = clientX - originX-6;
    const percent = Math.min(
      100,
      Math.max(initPercent + Math.ceil((100 * dx) / w), 0)
    );
    curValue.value = percent;
    pointer.value = percent;
  }
  function onMouseMove(event: MouseEvent) {
    moveAt(event.clientX);
  }
  document.addEventListener('mousemove', onMouseMove);

  document.addEventListener(
    'mouseup',
    () => {
      document.removeEventListener('mousemove', onMouseMove);
    },
    {
      once: true
    }
  );
  el.ondragstart = function () {
    return false;
  };
};
const clickHandler = (e: MouseEvent) => {
  const w = Number(progressRef.value?.getBoundingClientRect().width) || 100;
  let nLeft = progressRef.value?.offsetLeft||0;
  
  const nX = e.clientX - nLeft-12;
  console.log(progressRef.value?.offsetLeft)
  console.log(e.clientX)
  const percent = Math.min(100, Math.max(Math.ceil((100 * nX) / w), 0));
  curValue.value = percent;
  pointer.value = percent;
};
const setValue = (value: number) => {
  
  const curVal = (100 / (props.maxValue - props.initValue)) * value;
  curValue.value = Math.min(curVal, 100);
  pointer.value = Math.min(curVal, 100);
};
</script>
