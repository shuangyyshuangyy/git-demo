<template>
  <template v-if="isSvg">
    <svg-icon
      class="flex-shrink-0 inline-block outline-none"
      :fill="fill"
      :width="width"
      :height="height"
      :name="icon.replace('.svg', '')"
    />
  </template>
  <template v-else>
    <img-icon class="flex-shrink-0 inline-block" :width="width" :icon="icon" />
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 24
  },
  height: {
    type: Number,
    default: 24
  },
  fill: {
    type: String,
    default: '#ffffff'
  }
});
const isSvg = computed(() => props.icon.toLowerCase().endsWith('.svg'));
</script>
