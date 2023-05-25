<template>
  <div class="w-[629px] bg-black rounded" @click.stop>
    <div>
      <div class="py-3 px-4">
        <BaseSearchInput
          ref="searchRef"
          @search-source="searchSource"
        ></BaseSearchInput>
      </div>
      <div class="h-[1px] w-full bg-black-border px-4"></div>
      <div
        class="w-full h-[40px] flex justify-between items-center pl-10 pr-20"
      >
        <span>数据</span>
        <span>描述</span>
        <span>返回值</span>
      </div>
      <div class="h-[1px] w-full bg-black-border px-4"></div>
      <div class="max-h-[400px] overflow-y-auto scrollbarstyle">
        <div
          v-for="list of datalist"
          :key="list.label"
          class="text-xs text-[#CECECE]"
        >
          <div class="text-xs py-2 opacity-[0.4] px-2">
            <span>{{ list.label }}</span>
          </div>
          <div v-if="list.list.length > 0">
            <div
              v-for="item of list.list"
              :key="item.key"
              class="flex justify-around text-xs py-2 pl-6 hover:bg-black-50"
              :style="{
                background: item.key == selectedSource.key ? '#3E3E3E' : ''
              }"
              @click="setSelectSource(item)"
            >
              <div class="w-[150px] text-left">{{ item.label }}</div>
              <div class="w-[220px] text-center">{{ item.comment }}</div>
              <div class="w-[220px] text-center">{{ item.value }}</div>
            </div>
          </div>
          <div class="flex items-center justify-center py-2" v-else>
            此分类下无数据
          </div>
        </div>
      </div>

      <div class="h-[1px] w-full bg-black-border px-4"></div>
      <div class="p-2 flex justify-end">
        <button
          class="w-[60px] h-[30px] bg-white text-black rounded"
          @click="add"
        >
          添加
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { dataSourceList } from '@/utils/dataSource.data';
import { computed, reactive, ref } from 'vue';
const emits = defineEmits<{
  (
    event: 'selectDataSource',
    label: string,
    item: string,
    minValue: string,
    maxValue: string,
    value: string
  ): void;
}>();
const props = defineProps({
  dataSourceList: {
    type: Array,
    default: []
  }
});

type item = {
  label: string;
  key: string;
  comment: string;
  minValue: string;
  maxValue: string;
  value: string;
};
type list = {
  label: string;
  list: Array<item>;
};
//格式化数据列表
const dataList = computed(() => {
  let item1: list = { label: '时间', list: [] };
  let item2: list = { label: '健康', list: [] };
  let item3: list = { label: '天气', list: [] };
  let item4: list = { label: '系统', list: [] };
  for (let o in dataSourceList) {
    let obj = dataSourceList[o as keyof typeof dataSourceList];
    let value =
      obj.value !== ''
        ? obj.value
        : '[' + obj.minValue + ',' + obj.maxValue + ']';
    let obj1: item = {
      label: obj.label,
      key: obj.key,
      comment: obj.comment,
      maxValue: obj.maxValue,
      minValue: obj.minValue,
      value: value
    };
    if (obj.type == 'time') {
      item1.list.push(obj1);
    } else if (obj.type == 'health') {
      item2.list.push(obj1);
    } else if (obj.type == 'weather') {
      item3.list.push(obj1);
    } else {
      item4.list.push(obj1);
    }
  }
  const res = [item1, item2, item3, item4];
  return res;
});
const searchRef = ref();
//计算包含搜索的
const datalist = computed(() => {
  if (selectContent.value !== '') {
    let list = dataList.value.map((item) => {
      return JSON.parse(JSON.stringify(item));
    });
    let res = [];
    for (let arr of list) {
      arr.list = arr.list.filter((p: any) => {
        if (
          p.label.indexOf(selectContent.value) > -1 ||
          p.comment.indexOf(selectContent.value) > -1
        ) {
          return p;
        }
      });
      res.push(arr);
    }
    return res;
  } else {
    return dataList.value;
  }
});
const selectedSource = reactive({
  label: '',
  key: '',
  minValue: '',
  maxValue: '',
  value: ''
});
const setSelectSource = (item: any) => {
  if (selectedSource.key !== item.key) {
    selectedSource.key = item.key;
    selectedSource.label = item.label;
    selectedSource.maxValue = item.maxValue;
    selectedSource.minValue = item.minValue;
    selectedSource.value = item.value;
  } else {
    selectedSource.key = '';
    selectedSource.label = '';
    selectedSource.maxValue = '';
    selectedSource.minValue = '';
    selectedSource.value = '';
  }
};
const add = () => {
  if (selectedSource.key == '') {
    alert('请选择数据源');
  } else {
    emits(
      'selectDataSource',
      selectedSource.label,
      selectedSource.key,
      selectedSource.minValue,
      selectedSource.maxValue,
      selectedSource.value
    );
  }
};
const selectContent = ref('');
const searchSource = (content: string) => {
  selectContent.value = content;
};
</script>
<style scoped>
.scrollbarstyle::-webkit-scrollbar-track {
  border-radius: 0;
  background: #cecece;
}
.scrollbarstyle::-webkit-scrollbar {
  width: 10px;
}
</style>
