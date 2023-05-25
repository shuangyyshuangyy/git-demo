<template>
  <div class="">
    <div class="">数据源</div>
    <div class="text-[16px] mt-3">
      <div
        class="w-full h-[35px] bg-black-50 border border-black-border rounded-[7px] flex items-center justify-between px-3 mb-3"
        @click.stop="add"
        :class="{
          'bg-[#D9D9D9]': !source
        }"
      >
        <template v-if="source">
          <span>{{ currentSource?.label ?? '选择数据源' }}</span>
          <Icon icon="exchange.svg" :width="18" :height="18" />
        </template>
        <div v-else class="w-full flex justify-center">
          <icon icon="add2.svg" :width="14" :height="14" fill="none" />
        </div>
      </div>
      <!-- 返回值 -->
      <div v-if="!!currentSource" class="flex justify-between px-2 opacity-50">
        <div class="text-sm">
          <span>返回值</span>
          <span class="ml-3">{{
            currentSource
              ? currentSource?.valueRange ??
                '[' +
                  currentSource?.minValue +
                  ',' +
                  currentSource?.maxValue +
                  ']'
              : '-'
          }}</span>
        </div>
      </div>
    </div>

    <!-- 绑定属性 -->
    <div
      v-if="attr"
      class="mt-4"
      :class="{
        'cursor-not-allowed opacity-30': !currentSource?.key
      }"
    >
      <div class="mb-[7px]">绑定属性</div>
      <div>
        <div
          class="w-full h-[35px] bg-black-50 border border-black-border rounded-[7px] flex items-center justify-between px-3 mb-3"
        >
          {{ attr }}
        </div>
        <div class="flex justify-around items-center mb-6">
          <div class="text-lg text-white">起始</div>
          <a-input-number
            class="bg-transparent flex-1 pl-0 inline-block ml-1 text-lg"
            placeholder="输入"
            v-model:value="values['min']"
            @change="onChange"
          />
          <div class="ml-2 text-lg text-white">结束</div>
          <a-input-number
            class="bg-transparent flex-1 pl-0 inline-block ml-1 text-lg"
            placeholder="输入"
            v-model:value="values['max']"
            @change="onChange"
          />
        </div>
      </div>
    </div>
  </div>

  <DataSourceModal ref="refModel" @select="selectDataSource" />
</template>

<script lang="ts" setup>
import { DataSourceItem, useDataSource } from '@/hooks';
import { reactive, ref, watch } from 'vue';

const { findOne } = useDataSource();

const props = defineProps({
  source: {
    type: String,
    default: undefined
  },
  attr: {
    type: String,
    default: undefined
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  }
});

const values = reactive<{
  min?: number;
  max?: number;
}>({});

const emits = defineEmits<{
  (
    event: 'change',
    data: {
      source: string;
      min?: number;
      max?: number;
    }
  ): void;
}>();

const refModel = ref();
const add = () => {
  refModel.value?.open?.();
};

//初始化数据源
const currentSource = ref<DataSourceItem | undefined>();

watch(
  [() => props.source, () => props.max, () => props.min],
  () => {
    currentSource.value = findOne(props.source ?? '');
    values.max = props.max;
    values.min = props.min;
  },
  {
    immediate: true
  }
);
const selectDataSource = (item: DataSourceItem) => {
  currentSource.value = { ...item };
  emits('change', {
    source: currentSource.value.key,
    max: values.max,
    min: values.min
  });
};

const onChange = () => {
  emits('change', {
    source: currentSource.value?.key ?? '',
    max: values.max,
    min: values.min
  });
};
</script>
