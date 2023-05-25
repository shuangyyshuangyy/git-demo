<template>
  <a-collapse-panel>
    <template #header>效果</template>
    <template #extra>
      <div v-if="!isSelectDataSource" @click="addDataSource">
        <icon class="cursor-pointer" :icon="'add.svg'" :width="14" />
      </div>
      <div v-else @click="removeDataSource">
        <icon class="cursor-pointer" :icon="'subtract.svg'" :width="14" />
      </div>
    </template>
    <DataSorceContent
      v-if="isSelectDataSource"
      :is-select-data-source="isSelectDataSource"
      :cur-shape="props.curShape"
      @set-data-source="selectDataSource"
      @remove-data-source="removeDataSource"
    ></DataSorceContent>
  </a-collapse-panel>
</template>

<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { PropType, reactive, ref } from 'vue';

const props = defineProps({
  canAddSource: {
    type: Boolean,
    default: false
  },
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const emits = defineEmits<{
  (
    event: 'setDataSource',
    item: string,
    minValue: string,
    maxValue: string
  ): void;
  (event: 'removeDataSource'): void;
}>();

const currentSource = ref(props.curShape.attrs.source ?? '');
const isSelectDataSource = ref(currentSource ? true : false);

const selectDataSource = (
  label: string,
  item: string,
  minValue: string,
  maxValue: string
) => {
  emits('setDataSource', item, minValue, maxValue);
};
const removeDataSource = () => {
  isSelectDataSource.value = false;
  emits('removeDataSource');
};
const addDataSource = () => {
  if (props.canAddSource) {
    isSelectDataSource.value = true;
  } else {
    alert('请添加指针');
  }
};
</script>
