<template>
  <div class="my-2 ml-[10px]">
    <div class="w-1/2">
      <div class="text-xs opacity-40 my-2">当前显示</div>
      <BaseSelect
        v-model:value="slotType"
        :data="slotChildrenList"
        @select="setSlotType"
      ></BaseSelect>
      <div class="text-xs opacity-40 my-2">可选无</div>
      <div class="flex items-center" @click="setNoneSelect">
        <div
          class="h-[15px] w-[15px] rounded-[7px] border px-[2px] py-[2px] mr-2"
        >
          <div
            class="bg-white w-[10px] h-[10px] rounded-[6px]"
            v-if="noneSelect"
          ></div>
        </div>
        <span>无</span>
      </div>
    </div>
    <div class="flex-col px-3 py-2 my-4 bg-black w-3/4 rounded-[11px]">
      <div class="text-xs opacity-40 mb-3">容器列表</div>
      <div v-for="item in selectList" :key="item.label">
        <div
          class="w-[90%] h-[40px] bg-white rounded-[8px] mb-1 text-black flex items-center"
        >
          <div class="w-6 h-6 bg-black rounded-[12px] mx-3"></div>
          <div>
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { computed, PropType, ref } from 'vue';
const IsFold = ref(true);
const slotType = ref('');

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  },
  slotType: {
    type: String,
    default: 'widget'
  }
});

const slotTypeList = [
  { label: '音乐', value: 'music' },
  { label: '活力指标', value: 'activities' },
  { label: '世界时钟', value: 'worldClock' },
  { label: '指南针', value: 'compass' },
  { label: '日历', value: 'calendar' },
  { label: '股票', value: 'stocks' },
  { label: '计时器', value: 'timer' },
  { label: '闹钟', value: 'alarm' },
  { label: '支付宝', value: 'alipay' },
  { label: '微信支付', value: 'wechatPay' },
  { label: '天气', value: 'weather' },
  { label: '健康', value: 'health' }
];

const slotChildrenList = computed(() => {
  if (props.curShape.children && props.slotType !== 'appWidget') {
    return props.curShape.children.map((item) => {
      let obj = { label: item.name, value: item.id };
      return obj;
    });
  } else {
    return slotTypeList;
  }
});

const setSlotType = () => {};
const noneSelect = ref(false);
const setNoneSelect = () => {
  noneSelect.value = !noneSelect.value;
};
const selectList = computed(() => {
  let res = [];
  if (slotType.value) {
    let item = { label: '', value: slotType.value };
    for (let o of slotChildrenList.value) {
      if (o.value == slotType.value) {
        item.label = o.label;
      }
    }
    res.push(item);
  }
  if (noneSelect.value) {
    let item = { label: '无', value: '' };
    res.push(item);
  }
  return res;
});
</script>
