<template>
  <div class="px-5">
    <div class="mb-[7px]">绑定属性</div>

    <div v-if="props.curShapeType == 'ImageArray'">
      <ImageArrayList
        :cur-shape-type="props.curShapeType"
        :cur-shape="props.curShape"
        :cur-source="props.curSource"
      ></ImageArrayList>
    </div>
    <div v-else>
      <div
        class="rounded text-[16px] mb-3 h-[35px] border border-black-border px-3 flex items-center"
      >
        {{ bindAttr }}
      </div>
      <div class="flex justify-around items-center mb-6 opacity-50 text-[16px]">
        <div>起始</div>
        <input class="w-[60px] bg-black-50" placeholder="输入" />
        <div class="ml-2">结束</div>
        <input class="w-[60px] bg-black-50" placeholder="输出" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { dataSourceList } from '@/utils/dataSource.data';
import { PropType, ref } from 'vue';

const props = defineProps({
  curShapeType: {
    type: String,
    default: ''
  },
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  },
  curSource: {
    type: String,
    default: ''
  }
});

const bindAttr = ref('文本');
</script>
