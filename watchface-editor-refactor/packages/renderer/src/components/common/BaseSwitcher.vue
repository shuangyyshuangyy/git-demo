<template>
  <div
    class="bg-[#EBEBEB] flex-shrink-0 w-[36px] h-[20px] rounded-xl flex items-center cursor-pointer"
    :style="{
      opacity: checked ? '1' : '0.5'
    }"
    @click="onSwitch"
  >
    <div
      id="point"
      class="w-[12px] h-[12px] ml-[4px] bg-[#EB4E27] rounded-xl transition-all"
      :style="{
        marginLeft: checked ? '20px' : '4px'
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  }
});

const checked = ref(props.value);

watch(
  () => props.value,
  () => {
    checked.value = props.value;
  }
);

const emits = defineEmits<{
  (event: 'update:value', value: boolean): void;
  (event: 'update', value: boolean): void;
}>();

const onSwitch = () => {
  checked.value = !checked.value;
  emits('update:value', checked.value);
  emits('update', checked.value);
};
</script>
