<template>
  <div class="my-2 ml-[10px] w-1/2">
    <BaseSelect
      v-model:value="slotType"
      :data="slotTypeList"
      @select="setSlotType"
    ></BaseSelect>
  </div>
</template>
<script lang="ts" setup>
import { SlotAttribute } from '@/services/shape/attributes/slot';
import { ref } from 'vue';

const props = defineProps({
  slotType: {
    type: String,
    default: ''
  }
});

const IsFold = ref(true);
const slotType = ref(props.slotType);

const slotTypeList = [
  { label: '数据项', value: 'widget' },
  { label: '时间', value: 'time' },
  { label: '刻度盘', value: 'dial' },
  { label: '应用小组件', value: 'appWidget' }
];
const emits = defineEmits<{
  (
    event: 'setAttribute',
    attrName: keyof SlotAttribute,
    attrInput: string | number
  ): void;
}>();
const setSlotType = (item: BaseSelectItem) => {
  // emits('setAttribute', 'type', item.value);
};
</script>
