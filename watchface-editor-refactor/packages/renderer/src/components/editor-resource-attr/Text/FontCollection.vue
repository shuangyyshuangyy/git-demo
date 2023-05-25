<template>
  <div class="mt-[10px] text-[12px]">
    <div class="mb-1">字体</div>
    <div>
      <BaseSelect
        v-model:value="fontId"
        :data="fontIdList"
        @select="setFontId"
      ></BaseSelect>
    </div>
    <div class="flex mt-[10px]">
      <div class="w-1/2 mr-[19px]">
        <div class="mb-1">字重</div>
        <BaseSelect
          v-model:value="fontWeight"
          :data="fontWeightList"
          @select="setFontWeight"
        ></BaseSelect>
      </div>
      <div class="w-1/2">
        <div class="mb-1">字号</div>
        <BaseSelect
          v-model:value="fontSize"
          :data="fontSizeList"
          @select="setFontSize"
        ></BaseSelect>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TextAttribute } from '@/services/shape/attributes/text';
import { computed, onMounted, ref, watch } from 'vue';
const props = defineProps({
  fontId: {
    type: String,
    default: 'MiSansW'
  },
  fontSize: {
    type: String,
    default: '20'
  },
  fontWeight: {
    type: String,
    default: 'Regular'
  }
});

const fontId = ref(props.fontId);
const fontWeight = ref(props.fontWeight);
const fontSize = ref(props.fontSize);
const fontIdList = [
  { label: 'MiSansLatin', value: 'misanslatin' },
  { label: 'MiSansW', value: 'misansw' },
  { label: 'MiSanstc', value: 'misanstc' },
  { label: 'MiSans', value: 'misans' }
];
const fontWeightList = [
  { label: 'Bold', value: 'bold' },
  { label: 'Demibold', value: 'demibold' },
  { label: 'ExtraLight', value: 'extralight' },
  { label: 'Heavy', value: 'heavy' },
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Normal', value: 'normal' },
  { label: 'Regular', value: 'regular' },
  { label: 'Semibold', value: 'semibold' },
  { label: 'Thin', value: 'thin' }
];
const fontSizeList = [
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '18', value: '18' },
  { label: '20', value: '20' },
  { label: '22', value: '22' },
  { label: '24', value: '24' },
  { label: '26', value: '26' },
  { label: '30', value: '30' }
];
const emits = defineEmits<{
  (
    event: 'setAttribute',
    attrName: keyof TextAttribute,
    attrInput: string | number
  ): void;
}>();
const setFontId = (item: BaseSelectItem) => {
  emits('setAttribute', 'fontId', item.value);
};
const setFontWeight = (item: BaseSelectItem) => {
  emits('setAttribute', 'fontWeight', item.value);
};
const setFontSize = (item: BaseSelectItem) => {
  emits('setAttribute', 'fontSize', item.value);
};
watch(
  () => [props.fontId, props.fontSize, props.fontWeight],
  () => {
    fontId.value = props.fontId;
    fontSize.value = props.fontSize;
    fontWeight.value = props.fontWeight;
  }
);
</script>
