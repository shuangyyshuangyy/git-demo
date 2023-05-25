<template>
  <div @click="() => emits('change', !status)" class="cursor-pointer">
    <icon
      :icon="status ? 'subtract.svg' : 'add.svg'"
      :width="14"
      :height="14"
      fill="none"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
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
