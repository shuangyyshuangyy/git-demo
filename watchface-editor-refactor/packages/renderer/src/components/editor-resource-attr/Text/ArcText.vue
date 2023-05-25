<template>
  <div class="mt-[10px] text-[12px]">
    <div class="flex mt-[10px]">
      <div class="w-1/2 mr-[19px]">
        <div class="mb-1">圆弧半径</div>
        <input
          type="text"
          class="bg-black-50 w-full h-[28px] mr-[1px] border border-black-border px-1"
          v-model="radius"
          @change="(e) => setAttribute('radius', radius)"
        />
      </div>
      <div class="w-1/2">
        <div class="mb-1">文字贴边</div>
        <BaseSelect
          v-model:value="position"
          :data="positionList"
          @select="setPosition"
        ></BaseSelect>
      </div>
    </div>
    <div class="flex-col mt-[10px]">
      <div class="mb-1">起始角度</div>
      <div class="flex items-center">
        <div class="w-1/2 mr-[19px]">
          <input
            type="text"
            class="bg-black-50 w-full h-[28px] mr-[1px] border border-black-border px-1"
            v-model="startAngle"
            @change="(e) => setAttribute('startAngle', startAngle)"
          />
        </div>
        <div class="w-1/2 flex">
          <div class="flex" @click="setReverse">
            <div
              class="h-[15px] w-[15px] rounded-[7px] border px-[2px] py-[2px] mr-2"
            >
              <div
                class="bg-white w-[10px] h-[10px] rounded-[6px]"
                v-if="selectedReverse"
              ></div>
            </div>
            <span>翻转文本方向</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TextAttribute } from '@/services/shape/attributes/text';
import { ref, watch } from 'vue';
const props = defineProps({
  radius: {
    type: String,
    default: '0'
  },
  position: {
    type: String,
    default: 'Outside'
  },
  startAngle: {
    type: String,
    default: '0'
  }
});
const radius = ref(props.radius);
const startAngle = ref(props.startAngle);
const position = ref(props.position);
const positionList = [
  { label: 'Inside', value: 'Inside' },
  { label: 'center', value: 'center' },
  { label: 'Outside', value: 'Outside' }
];
const emits = defineEmits<{
  (
    event: 'setAttribute',
    attrName: keyof TextAttribute,
    attrInput: string | number
  ): void;
}>();
const setPosition = (item: BaseSelectItem) => {
  //emits('setAttribute', 'fontSize', item.value);
};
const setAttribute = (
  attrName: keyof TextAttribute,
  attrInput: string | number
) => {
  emits('setAttribute', attrName, attrInput);
};
const selectedReverse = ref(false);
const setReverse = () => {
  selectedReverse.value = !selectedReverse.value;
};
watch(
  () => [props.radius, props.startAngle],
  () => {
    radius.value = props.radius;
    startAngle.value = props.startAngle;
  }
);
</script>
