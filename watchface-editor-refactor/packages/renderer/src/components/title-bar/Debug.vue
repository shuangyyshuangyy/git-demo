<template>
  <div
    class="flex justify-start _no_drag ml-[140px] cursor-pointer absolute left-1/2 top-[14px]"
  >
    <button class="m-auto" @click="printInfo">打印信息</button>
  </div>
</template>
<script lang="ts" setup>
import { useLayerStore } from '@/store/use-layer-store';
import { useImagesStore } from '@/store/use-images-store';
import { useSelectStore } from '@/store/use-select-store';
import { Shape } from '@/services/shape';

const printInfo = async () => {
  console.log('---layers', useLayerStore().themes);
  console.log('---shapes', Shape.shapeTree(useSelectStore().themeId, false));
  console.log('---images', useImagesStore().images);
};
</script>
