<template>
  <div
    class="flex flex-col"
    @dblclick="() => pick()"
    @contextmenu="(event) => showModel(event)"
  >
    <div
      class="w-[280px] h-[280px] flex item-center justify-center rounded-t-xl border-[2px] border-black-50 p-7"
    >
      <img v-if="src" class="w-full h-full" :src="src" />
      <div
        v-else-if="imgType == 'square'"
        class="flex items-center justify-center w-[200px] h-[200px] image_empty rounded-[20px] bg-[#C9C9C9]"
      />
      <div
        v-else-if="imgType == 'circle'"
        class="flex items-center justify-center w-[200px] h-[200px] image_empty rounded-[100px] bg-[#C9C9C9]"
      />
      <div
        v-else
        class="flex items-center justify-center w-[100px] h-[220px] image_empty rounded-[50px] bg-[#C9C9C9]"
      />
    </div>
    <div
      class="flex text-white bg-black-50 w-[280px] h-[80px] rounded-b-xl pt-2 pl-6"
    >
      <div class="flex flex-col">
        <div class="text-[18px]">{{ title }}</div>
        <div class="text-[14px] opacity-60 mt-1">
          <span class="mr-2 hover:opacity-80">
            {{ deviceType }}
          </span>
          <span class="mr-2 hover:opacity-80">
            {{ openTime }}
          </span>
        </div>
      </div>
      <div class="flex-1"></div>
      <div class="mr-[30px] pt-3">
        <Icon
          icon="collect.svg"
          :width="20"
          :height="20"
          v-if="IsCollect"
          @click="changeCollect"
        />
        <div
          class="opacity-0 hover:opacity-100"
          @click="changeCollect"
          v-if="!IsCollect"
        >
          <Icon icon="uncollect.svg" :width="20" :height="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onUnmounted, PropType, ref, watch } from 'vue';
import { getImageBase64 } from '@/utils/fs/image.utils';

const emits = defineEmits<{
  (event: 'openWatchface', path: string): void;
  (
    event: 'openSuspendWindow',
    openRef: boolean,
    left: string,
    top: string,
    path: string
  ): void;
  (event: 'changeCollect', path: string, collect: boolean): void;
}>();
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    default: ''
  },
  deviceType: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  },
  lastOpened: {
    type: Number,
    default: ''
  },
  collect: {
    type: Boolean,
    default: false
  }
});
const src = ref('');
watch(
  () => props.pic,
  async (val) => {
    src.value = (await getImageBase64(val)) ?? '';
  },
  { immediate: true }
);
const option = [
  { name: 'M62', type: 'circle' },
  { name: 'K62/K63', type: 'circle' },
  { name: 'L61Simulator', type: 'circle' },
  { name: 'L61', type: 'circle' },
  { name: 'N60', type: 'circle' },
  { name: 'M65S', type: 'square' },
  { name: 'K65', type: 'square' },
  { name: 'K65A', type: 'square' },
  { name: 'K67', type: 'square' },
  { name: 'L67', type: 'square' },
  { name: 'M66', type: 'run' }
];
const imgType = computed(() => {
  let obj = option.filter((item) => item.name === props.deviceType)[0];
  return obj.type;
});

const openTime = computed(() => {
  let dateNow = Date.now();
  let hour = Math.floor((dateNow - props.lastOpened) / 60000 / 60);
  if (hour < 1) {
    return '刚刚';
  } else if (hour < 24) {
    return hour + '小时前';
  } else {
    return Math.floor(hour / 24) + '天前';
  }
});
const pick = () => {
  emits('openWatchface', props.path);
};

const refModel = ref(false);
const modelTop = ref('0px');
const modelLeft = ref('0px');
const showModel = (event: any) => {
  refModel.value = refModel.value == true ? false : true;
  modelLeft.value = event.clientX + 'px';
  modelTop.value = event.clientY + 'px';
  emits(
    'openSuspendWindow',
    refModel.value,
    modelLeft.value,
    modelTop.value,
    props.path
  );
};

const IsCollect = ref(props.collect);
watch(
  () => props.collect,
  () => {
    IsCollect.value = props.collect;
  }
);
const changeCollect = () => {
  IsCollect.value = IsCollect.value ? false : true;
  emits('changeCollect', props.path, IsCollect.value);
};
</script>
<style scoped></style>
