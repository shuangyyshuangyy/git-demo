<template>
  <div class="mt-[17px]">
    <div class="mb-1">对齐</div>
    <div class="flex w-[94px] justify-between items-center h-[30px]">
      <div
        class="py-[6px] px-1"
        :style="{
          backgroundColor: selectedAlign === 'left' ? '#444444' : ''
        }"
        @click="(e) => setAlign('left')"
      >
        <Icon icon="leftAlign.svg" :width="15" :height="15" />
      </div>
      <div
        class="py-[6px] px-1"
        :style="{
          backgroundColor: selectedAlign === 'center' ? '#444444' : ''
        }"
        @click="(e) => setAlign('center')"
      >
        <Icon icon="centerAlign.svg" :width="15" :height="15" />
      </div>
      <div
        class="py-[6px] px-1"
        :style="{
          backgroundColor: selectedAlign === 'right' ? '#444444' : ''
        }"
        @click="(e) => setAlign('right')"
      >
        <Icon icon="rightAlign.svg" :width="15" :height="15" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TextAttribute } from '@/services/shape/attributes/text';
import { ref } from 'vue';

const props = defineProps({
  textAlign: {
    type: String,
    default: 'left'
  }
});
const selectedAlign = ref(props.textAlign);
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
const setAlign = (_align: any): void => {
  selectedAlign.value = _align;
  setAttribute('align', _align);
};
</script>
