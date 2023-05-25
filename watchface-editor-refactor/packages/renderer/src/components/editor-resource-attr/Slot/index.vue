<template>
  <a-collapse v-model:activeKey="activeKey" ghost>
    <a-collapse-panel key="1" header="容器类型">
      <SlotType
        :slot-type="slotType"
        @set-attribute="setAttrsAttribute"
      ></SlotType>
    </a-collapse-panel>
    <a-collapse-panel key="1" header="容器列表">
      <SlotList :cur-shape="props.curShape" :slot-type="slotType"></SlotList>
    </a-collapse-panel>
    <a-collapse-panel key="1" header="容器边框">
      <SlotBorder
        :cur-shape="props.curShape"
        :cur-name="props.curShape.id"
      ></SlotBorder>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { SlotAttribute } from '@/services/shape/attributes/slot';
import { PropType, ref } from 'vue';

const activeKey = ref(['1']);
const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});

const attrs = ref(props.curShape.attrs as SlotAttribute);
const slotType = ref();

const setAttrsAttribute = (
  attrName: keyof SlotAttribute,
  attrInput: string | number
) => {
  props.curShape?.setAttrs({ [attrName]: attrInput });
  // if (attrName == 'type') slotType.value = String(attrInput);
};
</script>
