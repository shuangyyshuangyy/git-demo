<template>
  <div class="h-[1px] w-full bg-black-border px-4 mt-5" />
  <!-- 类型 -->
  <ProgressAttrs :shape="curShape" />
  <div class="h-[1px] w-full bg-black-border px-4 my-5" />
  <ProgressImage :shape="curShape" />
  <a-collapse v-model:activeKey="activeKey" ghost class="mt-4">
    <a-collapse-panel key="1" header="效果">
      <data-source2
        :source="props.curShape.attrs.source"
        :min="props.curShape.attrs['valueStart']"
        :max="props.curShape.attrs['valueEnd']"
        @change="onChange"
        attr="进度"
      />
    </a-collapse-panel>
  </a-collapse>
  <!-- 数据源 -->
</template>
<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { PropType, ref } from 'vue';

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});

const activeKey = ref(['1', '2']);
const onChange = ({
  source,
  min,
  max
}: {
  source: string;
  min?: number;
  max?: number;
}) => {
  props.curShape.setAttrs({
    valueStart: min,
    valueEnd: max,
    source
  });
};
</script>
