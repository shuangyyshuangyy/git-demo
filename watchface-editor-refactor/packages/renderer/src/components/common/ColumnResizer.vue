<template>
  <div
    class="w-[4px] h-full cursor-ew-resize absolute"
    @mousedown="onMouseDown"
  ></div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import { PropType } from 'vue';

const props = defineProps({
  divEl: {
    type: Object as PropType<HTMLDivElement>
  },
  min: {
    type: Number,
    default: -100
  },
  max: {
    type: Number,
    default: Number.MAX_VALUE
  },
  right: {
    type: Boolean,
    default: false
  }
});

const onMouseDown = (e: MouseEvent) => {
  const el = props.divEl;
  if (!el) return;
  const x0 = e.pageX;
  const w0 = el.clientWidth ?? 0;
  const move = debounce((e: MouseEvent) => {
    const x = e.pageX;
    const offset = (x - x0) * (props.right ? -1 : 1);
    let width = w0 + offset;
    width = Math.max(props.min, width);
    width = Math.min(props.max, width);
    el.style.width = width + 'px';
  });
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move);
  });
};
</script>

<style scoped></style>
