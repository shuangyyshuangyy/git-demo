<template>
  <div
    id="needHide-Container"
    class="w-[232px] bg-black absolute z-10 px-[10px]"
    :style="{ left: props.left, top: props.top }"
    @click.stop
  >
    <div class="flex-col divide-y text-[18px]">
      <div class="my-[10px]" @click="open">打开</div>
      <div>
        <div class="my-[10px]">创建副本</div>
        <div class="my-[10px]" @click="openPath">打开文件所在位置</div>
      </div>
      <div>
        <div class="my-[10px]">编辑表盘信息</div>
        <div class="my-[10px]" @click="changeCollect">收藏</div>
      </div>
      <div class="my-[10px]" @click="removeItem">从列表移除</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWatchfaceHistory } from '@/hooks/use-watchface-history';
import { ref, watch } from 'vue';
const emits = defineEmits<{
  (event: 'openWatchface', path: string): void;
  (event: 'removeWatchface', path: string): void;
  (event: 'openPath', path: string): void;
  (event: 'changeCollect', path: string, collect: boolean): void;
}>();
const props = defineProps({
  left: {
    type: String,
    required: true
  },
  top: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  }
});
const { deleteFromStorage } = useWatchfaceHistory();
const open = () => {
  emits('openWatchface', props.path);
};
const removeItem = () => {
  emits('removeWatchface', props.path);
};
const openPath = () => {
  emits('openPath', props.path);
};
const changeCollect = () => {
  emits('changeCollect', props.path, true);
};
</script>
<style scoped></style>
