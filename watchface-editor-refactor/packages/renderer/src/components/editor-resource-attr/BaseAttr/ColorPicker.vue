<template>
  <div>
    <input
      type="color"
      id="head"
      name="head"
      :value="props.color"
      @change="(e) => setColor(e)"
      class="w-[16px] h-[16px]"
    />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: '#ffffff'
  }
});
const emits = defineEmits<{
  (event: 'pickUpColor', attrInput: string): void;
}>();

const setColor = (event: any) => {
  emits('pickUpColor', event.target.value);
};

const hexToRgb = (color: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : 'rgb(217, 217, 217)';
};
</script>
