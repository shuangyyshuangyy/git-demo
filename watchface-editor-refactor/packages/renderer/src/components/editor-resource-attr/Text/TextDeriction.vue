<template>
  <div class="mt-4 mb-[19px]">
    <div>文本方向</div>
    <div class="flex items-center justify-between mt-[7px]">
      <div class="flex" @click="(e) => setTextDirection('normal')">
        <div
          class="h-[15px] w-[15px] rounded-[7px] border px-[2px] py-[2px] mr-2"
        >
          <div
            class="bg-white w-[10px] h-[10px] rounded-[6px]"
            v-if="selectedDirection == 'normal'"
          ></div>
        </div>
        <span>横排</span>
      </div>
      <div class="flex" @click="(e) => setTextDirection('vertical')">
        <div
          class="h-[15px] w-[15px] rounded-[7px] border px-[2px] py-[2px] mr-2"
        >
          <div
            class="bg-white w-[10px] h-[10px] rounded-[6px]"
            v-if="selectedDirection == 'vertical'"
          ></div>
        </div>
        <span>竖排</span>
      </div>
      <div class="flex" @click="(e) => setTextDirection('arc')">
        <div
          class="h-[15px] w-[15px] rounded-[7px] border px-[2px] py-[2px] mr-2"
        >
          <div
            class="bg-white w-[10px] h-[10px] rounded-[6px]"
            v-if="selectedDirection == 'arc'"
          ></div>
        </div>
        <span>弧形文本</span>
      </div>
    </div>
  </div>
  <ArcText
    v-if="selectedDirection == 'arc'"
    :radius="props.radius"
    :start-angle="props.startAngle"
    @set-attribute="setAttribute"
  ></ArcText>
</template>
<script lang="ts" setup>
import { TextAttribute } from '@/services/shape/attributes/text';
import { ref } from 'vue';

const props = defineProps({
  style: {
    type: String,
    default: 'normal'
  },
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

const selectedDirection = ref(props.style);
const emits = defineEmits<{
  (
    event: 'setAttribute',
    attrName: keyof TextAttribute,
    attrInput: string | number
  ): void;
}>();

const setAttribute = (
  attrName: keyof TextAttribute,
  attrInput: string | number
) => {
  emits('setAttribute', attrName, attrInput);
};

const setTextDirection = (_direction: string) => {
  selectedDirection.value = _direction;
  setAttribute('style', _direction);
};
</script>
