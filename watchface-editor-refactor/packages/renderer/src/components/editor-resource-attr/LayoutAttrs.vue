<template>
  <div>
    <!-- <div class="my-5">位置</div> -->
    <!-- 对齐快捷操作 -->
    <div class="flex justify-between mt-5">
      <div
        v-for="item in alignItems"
        :key="item.align"
        @click="() => onClickAlign(item.align)"
      >
        <a-tooltip :title="item.tooltip">
          <Icon :icon="item.icon" :width="24" :height="24" fill="none" />
        </a-tooltip>
      </div>
    </div>
    <!-- x y坐标 -->
    <div class="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
      <template v-for="attr in attrItems" :key="attr.key">
        <div
          class="flex items-center text-base"
          :class="{
            ' opacity-30': attr.disabled
          }"
        >
          <div class="w-4 flex">
            <Icon
              v-if="attr.key == 'rotation'"
              icon="Angle.svg"
              :width="15"
              :height="15"
            />
            <span v-else class="opacity-50">
              {{ attr.label }}
            </span>
          </div>
          <a-input-number
            class="bg-transparent flex-1 pl-0 inline-block ml-1 text-base !text-white"
            v-model:value="values[attr.key]"
            :formatter="(value: any) => attr.key == 'rotation'? `${value}°` : value"
            :disabled="attr.disabled"
            @change="(val:number) => onChange(attr.key, val)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEmitterListener } from '@/hooks/use-event-listener';
import { Shape } from '@/services/shape';
import { EventType } from '@/utils/emitter.utils';
import { PropType, computed, onMounted, reactive, watch } from 'vue';

type AttrKey = 'x' | 'y' | 'w' | 'h' | 'rotation';

const props = defineProps({
  shape: {
    type: Object as PropType<Shape>,
    required: true
  },
  attrKeys: {
    type: Array as PropType<{ key: AttrKey; disabled?: boolean }[]>,
    required: true
  }
});

const values = reactive<Record<string, number>>({});
const initValues = () => {
  const shape = props.shape;
  if (!shape) return;
  props.attrKeys.map((item) => {
    const key = item.key;
    values[key] = key == 'rotation' ? 0 : shape.attrs[key] ?? 0;
  });
};

useEmitterListener(EventType['shape:set-attr'], initValues);

watch(() => props.shape.id, initValues, { immediate: true });

type Align = 'left' | 'right' | 'x-center' | 'top' | 'bottom' | 'y-center';
const alignItems: { icon: string; align: Align; tooltip: string }[] = [
  { icon: 'align_1.svg', align: 'left', tooltip: '左对齐' },
  { icon: 'align_2.svg', align: 'x-center', tooltip: '水平居中' },
  { icon: 'align_3.svg', align: 'right', tooltip: '右对齐' },
  { icon: 'align_4.svg', align: 'top', tooltip: '顶部对齐' },
  { icon: 'align_5.svg', align: 'y-center', tooltip: '垂直居中' },
  { icon: 'align_6.svg', align: 'bottom', tooltip: '底部对齐' }
];
const onClickAlign = (align: Align) => {
  console.log('');
};

const attrItems = computed(() => {
  const res: { key: AttrKey; label: string; disabled?: boolean }[] = [
    { key: 'x', label: 'X' },
    { key: 'y', label: 'Y' },
    { key: 'w', label: 'W' },
    { key: 'h', label: 'H' },
    { key: 'rotation', label: 'H' }
  ];

  return res
    .filter((item) => props.attrKeys?.some((item2) => item2.key == item.key))
    .map((item) => {
      item.disabled = !!props.attrKeys.find((item2) => item2.key == item.key)
        ?.disabled;
      return item;
    });
});

const onChange = (attr: AttrKey, val: number) => {
  if (attr !== 'rotation') {
    props.shape?.setAttrs({ [attr]: val });
  }
};
</script>

<style scoped></style>
