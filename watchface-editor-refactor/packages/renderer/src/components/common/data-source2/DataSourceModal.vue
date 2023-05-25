<template>
  <a-modal
    v-model:visible="visible"
    title="选择数据源"
    :width="800"
    :afterClose="afterClose"
  >
    <div>
      <!-- search -->
      <div class="">
        <a-input v-model:value="search" placeholder="搜索" class="h-9">
          <template #prefix>
            <Icon icon="search.svg" :width="20" :height="20" fill="none" />
          </template>
        </a-input>
      </div>

      <div class="w-full h-[40px] grid grid-cols-3 mt-3 px-4 items-center">
        <span>数据</span>
        <span>描述</span>
        <span>返回值</span>
      </div>
      <div class="h-[1px] w-full bg-black-border px-4" />
      <div class="max-h-[450px] overflow-y-auto">
        <div
          v-for="(list, label) in dataList"
          :key="label"
          class="text-xs text-[#CECECE]"
        >
          <div class="text-xs py-2 opacity-[0.4] px-0">
            <span>{{ label }}</span>
          </div>
          <div
            v-for="item of list"
            :key="item.key"
            class="grid grid-cols-3 text-xs py-2 hover:bg-black-50 min-h-10 px-4 items-center"
            :class="{
              '!bg-[#2094FF]/10': item.key == selectedSource?.key
            }"
            @click="setSelectSource(item)"
          >
            <span class="">{{ item.label }}</span>
            <span class="">{{ item.comment }}</span>
            <span class="">{{
              item.valueRange ?? `[${item.minValue},${item.maxValue}]`
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button key="back" @click="() => (visible = false)">取消</a-button>
      <a-button
        :disabled="!selectedSource?.key"
        type="primary"
        @click="() => add()"
      >
        添加
      </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { DataSourceItem, dataSourceList } from '@/hooks';
import { computed, ref } from 'vue';
const emits = defineEmits<{
  (event: 'select', dataSource: DataSourceItem): void;
}>();

//格式化数据列表
const search = ref();
const dataList = computed(() => {
  const res: typeof dataSourceList = {};
  Object.entries(dataSourceList).forEach((dataSource) => {
    const [group, items] = dataSource;
    const items2 = items.filter(
      (item) => !search.value || item.label.includes(search.value)
    );
    if (items2.length) {
      res[group] = items2;
    }
  });
  return res;
});

const selectedSource = ref<DataSourceItem | undefined>();
const setSelectSource = (item: DataSourceItem) => {
  selectedSource.value = item;
};

const afterClose = () => {
  selectedSource.value = undefined;
};

const add = () => {
  if (selectedSource.value) {
    emits('select', { ...selectedSource.value });
    visible.value = false;
  }
};

const visible = ref(false);
defineExpose({
  open: () => {
    visible.value = true;
    selectedSource.value = undefined;
  }
});
</script>
<style scoped></style>
