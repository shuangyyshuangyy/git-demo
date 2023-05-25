<template>
  <div class="px-5 text-xs">
    <div class="mt-[15px] mb-[7px]">数据源</div>
    <div v-if="dataSource.key !== ''" class="text-[16px]">
      <div
        class="w-full h-[35px] bg-black-50 border border-black-border rounded-[7px] flex items-center justify-between px-3 mb-3"
        @click.stop
      >
        <span>{{ dataSource.label }}</span>
        <Icon
          icon="selectDataSource.svg"
          :width="18"
          :height="18"
          @click="add"
        />
      </div>
      <div class="flex justify-between px-4 mb-6 opacity-50">
        <div>
          <span>返回值</span>
          <span class="ml-3">{{
            dataSource.value !== ''
              ? dataSource.value
              : '[' + dataSource.minValue + ',' + dataSource.maxValue + ']'
          }}</span>
        </div>
        <!-- <div>
          <span>结束</span>
          <span class="ml-3">{{ dataSource.maxValue }}</span>
        </div> -->
      </div>
    </div>
    <div
      class="w-full h-[35px] bg-white rounded-[7px] flex items-center justify-center mb-6"
      v-else
      @click="add"
      @click.stop
    >
      <Icon icon="addButton.svg" :width="15" :height="15" />
    </div>
  </div>
  <DataSourceAttr
    :cur-shape-type="props.curShape.type"
    :cur-shape="props.curShape"
    :cur-source="dataSource.key"
  ></DataSourceAttr>
  <div class="fixed left-[32vw] top-[25vh] z-50" v-if="IsAddData">
    <DataSourceWindow
      ref="refModel"
      @select-data-source="selectDataSource"
    ></DataSourceWindow>
  </div>
</template>

<script lang="ts" setup>
import { Shape, ShapeType } from '@/services/shape';
import { dataSourceList } from '@/utils/dataSource.data';
import { onMounted, onUnmounted, PropType, reactive, ref, watch } from 'vue';

const props = defineProps({
  isSelectDataSource: {
    type: Boolean,
    default: true
  },
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const emits = defineEmits<{
  (
    event: 'setDataSource',
    label: string,
    item: string,
    minValue: string,
    maxValue: string
  ): void;
  (event: 'removeDataSource'): void;
}>();

const refModel = ref();
const IsAddData = ref(false);
const add = () => {
  IsAddData.value = !IsAddData.value;
};

//弹窗打开与关闭
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (refModel.value) IsAddData.value = false;
  });
});
onUnmounted(() => {
  document.removeEventListener('click', () => {
    console.log('remove');
  });
});

//初始化数据源
const currentSource = ref(props.curShape.attrs.source ?? '');
const temp = ref(
  dataSourceList[currentSource.value as keyof typeof dataSourceList] ?? ''
);
const dataSource = reactive({
  label: temp.value.label ?? '',
  key: temp.value.key ?? '',
  minValue: temp.value.minValue ?? '',
  maxValue: temp.value.maxValue ?? '',
  value: temp.value.value ?? ''
});

watch(
  () => props.curShape,
  () => {
    currentSource.value = props.curShape.attrs.source ?? '';
    temp.value =
      dataSourceList[currentSource.value as keyof typeof dataSourceList];
  }
);
const selectDataSource = (
  label: string,
  item: string,
  minValue: string,
  maxValue: string,
  value: string
) => {
  dataSource.label = label;
  dataSource.key = item;
  if (value !== '') {
    let temp =
      value.indexOf('&') == -1
        ? value.split(',').slice(1)
        : value.split('&')[0];
    console.log(temp);
  }
  dataSource.maxValue = maxValue;
  dataSource.minValue = minValue;
  dataSource.value = value;
  IsAddData.value = false;
  if (props.curShape.type === ShapeType.ImageArray) {
    props.curShape.setAttrs({ source: item });
    return;
  }
  emits('setDataSource', label, item, minValue, maxValue);
};
</script>
