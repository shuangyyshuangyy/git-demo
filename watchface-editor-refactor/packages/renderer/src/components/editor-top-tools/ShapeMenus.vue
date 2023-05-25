<template>
  <drop-down :menus="menus">
    <div class="flex justify-center items-center flex-col hover:opacity-50">
      <div class="w-[30px] h-7 bg-white" :style="{ borderRadius: '5px' }" />
      <span class="text-[12px] mt-[6px]">{{ title }}</span>
    </div>
  </drop-down>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
  menus: {
    type: Array as PropType<DropDownMenuItem[]>,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
</script>
