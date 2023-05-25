<template>
  <a-collapse v-model:activeKey="activeKey" ghost>
    <!-- 数据源 -->
    <a-collapse-panel key="1" header="效果">
      <data-source2 @change="setSource" :source="curShape.attrs.source" />
      <!-- 绑定属性 -->
      <div class="mt-8">
        <span>绑定属性</span>
        <drop-down :menus="menus" trigger="click">
          <div
            class="w-full h-[35px] bg-black-50 border border-black-border rounded-[7px] flex items-center justify-between px-3 my-3"
            :class="{
              'bg-[#D9D9D9]': !curShape.attrs.fillType
            }"
          >
            <template v-if="curShape.attrs.fillType">
              <span>{{ curShape.attrs.fillType ?? '选择填充类型' }}</span>
              <Icon icon="exchange.svg" :width="18" :height="18" />
            </template>
            <div v-else class="w-full flex justify-center">
              <icon icon="add2.svg" :width="14" :height="14" fill="none" />
            </div>
          </div>
        </drop-down>
        <!-- 图片列表 -->
        <ImageArrayList :cur-shape="curShape" />
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { computed } from 'vue';
import { PropType, ref } from 'vue';
const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const activeKey = ref(['1']);

const setSource = ({ source }: { source: string }) => {
  props.curShape?.setAttrs({ source });
};

const exchangeType = () => {};
const menus: DropDownMenuItem[] = [
  {
    title: '普通填充',
    onClick: () => {
      props.curShape?.setAttrs({ fillType: '普通填充' });
    }
  },
  {
    title: '数字填充',
    onClick: () => {
      props.curShape?.setAttrs({ fillType: '数字填充' });
    }
  }
];
// const showSource = ref(!!props.curShape.attrs.source);

// const onShowToggle = (status: boolean) => {
//   showSource.value = status;
//   if (status) {
//     if (!activeKey.value.includes('2')) activeKey.value.push('2');
//   } else {
//     props.curShape?.setAttrs({ source: '' });
//   }
// };
</script>
