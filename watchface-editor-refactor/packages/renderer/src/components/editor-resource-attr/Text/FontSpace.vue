<template>
  <div class="mt-4">
    <div class="my-1">字间距</div>
    <div class="flex items-center border border-[#565656] h-[30px] w-full">
      <div class="w-[20px] text-[14px] mx-[10px]">|A|</div>
      <input
        type="text"
        class="bg-black-50 w-full h-[28px] mr-[1px]"
        v-model="letterSpace"
        @change="(e) => setAttribute('letterSpace', letterSpace)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TextAttribute } from '@/services/shape/attributes/text';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  letterSpace: {
    type: String,
    default: '0'
  }
});
const letterSpace = ref(props.letterSpace);
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
watch(
  () => props.letterSpace,
  () => {
    letterSpace.value = props.letterSpace;
  }
);
</script>
