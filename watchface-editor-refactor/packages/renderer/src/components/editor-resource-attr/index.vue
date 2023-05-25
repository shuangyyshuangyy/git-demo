<template>
  <div
    class="bg-black-50 pt-4 border border-black-border attrs-panel min-h-full pb-3"
  >
    <div class="flex px-6">
      <div class="mr-6">属性</div>
      <div>动效</div>
    </div>
    <div class="h-[1px] mt-4 bg-black-border" />

    <!-- 布局属性 对齐 x y w h rotation 等 -->
    <LayoutAttrs
      class="mb-2 px-6"
      :shape="curShape"
      :attr-keys="
        curShape?.type == 'Text' || curShape?.type == 'Image'
          ? [
              { key: 'x' },
              { key: 'y' },
              { key: 'w' },
              { key: 'h' },
              { key: 'rotation' }
            ]
          : [{ key: 'x' }, { key: 'y' }]
      "
    />

    <!-- 图片 -->
    <template v-if="curShape?.type == ShapeType.Image">
      <Image :cur-shape="curShape" />
    </template>

    <!-- 图组 -->
    <template v-if="curShape?.type == ShapeType.ImageArray">
      <ImageValues :cur-shape="curShape" />
    </template>

    <!-- 文本 -->
    <template v-if="curShape?.type == 'Text'">
      <Text :cur-shape="curShape" />
    </template>

    <!-- 进度条 -->
    <template v-if="curShape?.type == ShapeType.ProgressBar">
      <ProgressBar :cur-shape="curShape" />
    </template>

    <!-- 容器 -->
    <template v-if="curShape?.type == 'Slot'">
      <Slot :cur-shape="curShape" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSelectStore } from '@/store/use-select-store';
import { ShapeType } from '@/services/shape';

const selectStore = useSelectStore();
const curShape = computed(() => selectStore.activeShape);
</script>

<style scoped></style>
