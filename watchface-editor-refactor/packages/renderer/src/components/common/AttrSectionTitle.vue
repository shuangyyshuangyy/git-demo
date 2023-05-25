<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      <span class="mr-2">
        {{ title }}
      </span>
      <slot />
    </div>
    <div @click="() => emits('change', !status)" class="cursor-pointer">
      <icon
        :icon="status ? 'subtract.svg' : 'add.svg'"
        :width="14"
        :height="14"
        fill="none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits<{
  (event: 'change', val: boolean): void;
}>();
</script>

<style scoped></style>
