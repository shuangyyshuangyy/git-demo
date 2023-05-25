<template>
  <div
    class="absolute h-6 select-none z-10"
    @click.stop="setShowCanvasScaleList"
  >
    {{ scale * 100 }}%
  </div>
  <div
    v-if="showCanvasScaleList"
    class="absolute z-10 mt-6 select-none"
    ref="selectContainer"
    @click="() => (showCanvasScaleList = false)"
  >
    <div v-for="scaleItem in canvasScale" class="">
      <div
        @click="
          () => {
            scale = scaleItem;
          }
        "
        class="bg-black-90 hover:bg-blue w-[60px] h-12 flex justify-between items-center px-2"
      >
        <div>{{ scaleItem * 100 }}%</div>
      </div>
    </div>
  </div>
  <div class="flex justify-center" @mouseup="onMouseUp" :style="canvasStyle">
    <div class="bg-black" :style="outerStyle">
      <canvas
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        id="watch-canvas"
        ref="canvas"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watchEffect } from 'vue';
import { useWatchfaceStore } from '@/store/use-watchface-store';
import { useCanvasSelect, useCanvasDrag } from '@/hooks/use-canvas-drag';
import { useCanvasRender } from '@/hooks/use-canvas-render';
import { Shape, ShapeType } from '@/services/shape';
import { useEmitterListener } from '@/hooks/use-event-listener';
import { EventType } from '@/utils/emitter.utils';
import { useSelectStore } from '@/store/use-select-store';

const watchInfo = useWatchfaceStore();
const curSelect = computed(() => useSelectStore().selectedIds);

const mouseSelect = ref(false);
const offsetXToLeft = ref(0);
const offsetYToTop = ref(0);

const width = computed(() => +(watchInfo.watchface.size?.w ?? 466));
const height = computed(() => +(watchInfo.watchface.size?.h ?? 466));

const scale = ref<number>(1);
const canvasScale = [0.5, 0.75, 1, 1.5];
const showCanvasScaleList = ref(false);
const setShowCanvasScaleList = () => {
  showCanvasScaleList.value = !showCanvasScaleList.value;
};

let canvas = ref<HTMLCanvasElement>();
const { render, loading } = useCanvasRender(canvas);

onMounted(() => {
  canvas.value = document.getElementById('watch-canvas') as HTMLCanvasElement;
  render();
});

watchEffect(() => {
  if (curSelect.value) {
    render();
  }
});

// todo 更改多个元素位置
const onMouseDown = (event: MouseEvent) => {
  mouseSelect.value = useCanvasSelect(event);
  curSelect.value.map((selectName: string) => {
    const curShape = Shape.getShape(selectName);
    if (curShape) {
      offsetXToLeft.value = event.offsetX - Number(curShape.attrs.x);
      offsetYToTop.value = event.offsetX - Number(curShape.attrs.x);
    }
  });
};

const onMouseMove = (event: MouseEvent) => {
  if (mouseSelect.value) {
    useCanvasDrag(
      event,
      curSelect.value,
      offsetXToLeft.value,
      offsetYToTop.value
    );
  }
};

const onMouseUp = () => {
  mouseSelect.value = false;
};

useEmitterListener(
  EventType['shape:set-attr'],
  ({ shapeId }: { shapeId: string }) => {
    const shape = Shape.getShape(shapeId);
    if (!shape) return;
    render();
  }
);
useEmitterListener(
  [
    EventType['shape:deleted'],
    EventType['theme:selected'],
    EventType['undo-redo'],
    EventType['shape:convert'],
    EventType['watchface:opened'],
    EventType['theme-color:selected']
  ],
  () => {
    render();
  }
);

const outerStyle = computed(() => {
  const w = width.value;
  const h = height.value;
  let radius = '';
  if (w === 320 && h === 360) radius = 44 + 'px';
  else if (w === 194 && h === 368) radius = 26 + 'px';
  else if (w === 466 && h === 466) radius = '50%';
  else if (w === 480 && h === 480) radius = '50%';

  return {
    width: w + 'px',
    height: h + 'px',
    transform: `scale(${scale.value})`,
    borderRadius: radius
  };
});

const canvasStyle = computed(() => {
  let width = 'auto';
  let height = 'calc(100vh + 100px)';
  let paddingTop = 'auto';
  let paddingBottom = '300px';
  switch (scale.value) {
    case 0.5:
      break;
    case 0.75:
      paddingTop = '0px';
      break;
    case 1:
      width = 'calc(50vw + 300px)';
      height = 'calc(100vh + 300px)';
      paddingTop = '100px';
      paddingBottom = '300px';
      break;
    case 1.5:
      width = 'calc(50vw + 300px)';
      height = '200vh';
      paddingTop = '30vh';
      paddingBottom = '70vh';
      break;
  }
  return {
    width,
    height,
    paddingTop,
    paddingBottom
  };
});
</script>

<style scoped>
/* ._container {
  height: calc(100vh + 300px);
  width: calc(100vh + 300px);
} */
</style>
