<template>
  <div
    class="bg-black z-10 absolute top-[48px] right-[30px] py-[30px] pl-[20px]"
    @click.stop
  >
    <div v-for="(arr, key) in option" :key="key">
      <div class="mb-[30px]">
        <span>{{ arr.title }}</span>
        <div class="flex mt-[20px]">
          <div v-for="(item, key1) in arr.list" :key="key1">
            <div
              class="bg-black-50 w-[120px] h-[45px] rounded-[64px] mr-[16px] flex justify-center items-center"
              :class="{ 'bg-white text-black': item.selected == true }"
              @click="getSelection(item.name, key)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex px-[10px] mr-[30px]">
      <div class="flex-1"></div>
      <div
        class="border rounded-[7px] w-[80px] h-[40px] leading-[40px] text-center mr-[20px] hover:bg-white hover:text-black"
        @click="reset"
      >
        重置
      </div>
      <div
        class="border rounded-[7px] w-[80px] h-[40px] leading-[40px] text-center hover:bg-white hover:text-black"
        @click="submit"
      >
        完成
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
const option = reactive([
  {
    title: '圆形',
    list: [
      { name: 'M62', type: 'circle', selected: false },
      { name: 'K62/K63', type: 'circle', selected: false },
      { name: 'L61Simulator', type: 'circle', selected: false },
      { name: 'L61', type: 'circle', selected: false },
      { name: 'N60', type: 'circle', selected: false }
    ]
  },
  {
    title: '方形',
    list: [
      { name: 'M65S', type: 'square', selected: false },
      { name: 'K65', type: 'square', selected: false },
      { name: 'K65A', type: 'square', selected: false },
      { name: 'K67', type: 'square', selected: false },
      { name: 'L67', type: 'square', selected: false }
    ]
  },
  {
    title: '跑道',
    list: [{ name: 'M66', type: 'run', selected: false }]
  }
]);

const emits = defineEmits<{
  (event: 'finishSelect', selection: Array<string>): void;
  (event: 'closeSelectWindow'): void;
}>();
const selectionList: Array<string> = [];
const getSelection = (name: string, key: any) => {
  let list = option[key].list;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (item.name === name) {
      item.selected = item.selected ? false : true;
    }
  }
  if (selectionList.includes(name)) {
    selectionList.splice(selectionList.indexOf(name), 1);
  } else {
    selectionList.push(name);
  }
};
const reset = () => {
  for (let i = 0; i < 3; i++) {
    let list = option[i].list;
    for (let j = 0; j < list.length; j++) {
      list[j].selected = false;
    }
  }
  selectionList.splice(0, selectionList.length);
  emits('closeSelectWindow');
};
const submit = () => {
  emits('finishSelect', selectionList);
  //emits('closeSelectWindow');
};
</script>
