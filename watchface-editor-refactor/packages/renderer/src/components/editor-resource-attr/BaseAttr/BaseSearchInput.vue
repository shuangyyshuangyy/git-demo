<template>
  <div class="w-full bg-black rounded" @click.stop>
    <div class="flex items-center">
      <Icon icon="search.svg" :width="25" :height="25" />
      <input
        class="w-full my-2 bg-black ml-3"
        v-model="InputValue"
        placeholder="搜索"
        @change="search"
        @input="search"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
interface dataSourceItem {
  label: string;
  key: string;
  minValue: string;
  maxValue: string;
  value: string;
  comment: string;
}
interface dataSourceList {
  label: string;
  list: dataSourceItem[];
}
const emits = defineEmits<{
  (event: 'searchSource', content: string): void;
}>();

const props = defineProps({
  dataSourceList: {
    type: Array as PropType<dataSourceList[]>,
    default: []
  }
});

const InputValue = ref('');

const debounce = (fn: any, delay: number) => {
  let timer: string | number | NodeJS.Timeout | undefined;
  return (...args: []) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      clearTimeout(timer);
    }, delay);
  };
};
const search = debounce(() => {
  emits('searchSource', InputValue.value);
}, 800);
</script>
<style scoped></style>
