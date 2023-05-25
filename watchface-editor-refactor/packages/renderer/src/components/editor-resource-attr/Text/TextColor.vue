<template>
  <div class="mt-4">
    <div class="my-1">颜色</div>
    <div class="flex items-center border border-[#565656] h-[30px] w-full">
      <div class="w-[20px] text-[14px] mx-[8px]">
        <ColorPicker
          :color="textColor"
          @pick-up-color="setTextColor"
        ></ColorPicker>
      </div>
      <input
        type="text"
        class="bg-black-50 w-full h-[28px] mr-[1px]"
        v-model="textColor"
        @change="(e) => setTextColor(textColor)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TextAttribute } from '@/services/shape/attributes/text';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: '#ffffff'
  }
});
const textColor = ref(props.color);

const emits = defineEmits<{
  (
    event: 'setAttribute',
    attrName: keyof TextAttribute,
    attrInput: string | number
  ): void;
}>();
const setAttribute = (
  attrName: keyof TextAttribute,
  attrInput: string | number
) => {
  emits('setAttribute', attrName, attrInput);
};
const setTextColor = (color: string) => {
  let selectColor = color[0] === '#' ? color : '#' + color;
  setAttribute('color', selectColor);
  textColor.value = color;
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
watch(
  () => props.color,
  () => {
    textColor.value = props.color;
  }
);
</script>
