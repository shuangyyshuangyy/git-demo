<template>
  <!-- 显示选择的内容 -->
  <div class="relative">
    <div
      class="relative inline-flex items-center justify-between px-4 bg-black-50 border border-black-border h-[30px] w-full"
      @click="isSelected = !isSelected"
      @click.stop
    >
      <div>
        <template v-if="!selectedItem">
          <span>{{ placeholder }}</span>
        </template>
        <template v-else>
          <template v-if="slots.title">
            <slot name="title" v-bind="selectedItem" />
          </template>
          <template v-else>
            <div class="overflow-hidden text-ellipsis whitespace-nowrap">
              {{ selectedItem.label }}
            </div>
          </template>
        </template>
      </div>
      <!-- 右侧下拉箭头 -->
      <icon icon="down.svg" :width="11" :height="6" class="ml-2" />
    </div>
    <div class="absolute top-9 left-0 w-full z-10" v-if="isSelected">
      <div
        class="scrollbarstyle h-full py-1 bg-black max-h-80 w-full overflow-y-auto"
      >
        <template v-if="data?.length">
          <base-select-item
            v-for="item in data"
            :key="item.value"
            :layer="item"
            :level="0"
            :on-select="_select"
            :selected="_val"
            :enter="(data: BaseSelectItem) => emits('enter', data)"
            :leave="(data:BaseSelectItem) => emits('leave', data)"
          >
            <template v-if="slots.title" #title="item2">
              <slot name="title" v-bind="item2" />
            </template>
          </base-select-item>
        </template>
        <template v-else>
          <div class="flex items-center justify-center h-full text-normal">
            <span class="opacity-70">没有数据</span>
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- 下拉选择框 -->
  <template class="absolute top-0 left-0"> </template>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  useSlots,
  watch
} from 'vue';

const slots = useSlots();

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  data: {
    type: Array as PropType<BaseSelectItem[]>,
    default: () => []
  }
});

const _val = ref(props.value);
const isSelected = ref(false);

watch(
  () => props.value,
  () => (_val.value = props.value)
);

const selectedItem = computed(() => {
  let _item: BaseSelectItem | undefined;
  const _find = (items: BaseSelectItem[]) => {
    for (let i = 0; i < items.length; i++) {
      if (_item !== undefined) break;
      const item = items[i];
      if (item.value == _val.value) {
        _item = item;
        break;
      } else {
        _find(item.children ?? []);
      }
    }
  };
  _find(props.data);
  return _item;
});

const emits = defineEmits<{
  (event: 'update:value', value: string | number): void;
  (event: 'select', data: BaseSelectItem): void;
  (event: 'enter', data: BaseSelectItem): void;
  (event: 'leave', data: BaseSelectItem): void;
}>();

const _select = (data: BaseSelectItem) => {
  if (data.value == selectedItem.value?.value) return;
  _val.value = data.value;
  isSelected.value = false;
  emits('update:value', data.value);
  emits('select', data);
};

defineExpose({
  getSelection: () => {
    return selectedItem.value;
  }
});
const closePanel = (e: Event) => {
  const el = e.target as HTMLDivElement;
  const flag = el.dataset.flag;
  if (isSelected.value && flag != selectedItem.value) isSelected.value = false;
};
onMounted(() => {
  window.addEventListener('click', closePanel);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', closePanel);
});
</script>
<style scoped>
.scrollbarstyle::-webkit-scrollbar-track {
  border-radius: 0;
  background: #1e1e1e;
}
.scrollbarstyle::-webkit-scrollbar {
  width: 5px;
}
</style>
