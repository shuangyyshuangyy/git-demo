<template>
  <div class="h-full p-4 overflow-auto">
    <div class="flex justify-between items-center my-4">
      <div>数字</div>
      <div class="w-[130px]">
        <input
          class="text-black-50"
          type="number"
          min="0"
          max="100"
          step="1"
          :value="numValue"
          @change="(e) => onChangeNum(e)"
        />
      </div>
    </div>
    <div class="mt-4 w-full">
      <input
        class="w-full"
        type="range"
        min="0"
        max="100"
        :value="numValue"
        @change="(e) => onChangeNum(e)"
        step="1"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const numValue = ref(20);
const onChangeNum = (e: Event) => {
  const currentNum = (e.target as HTMLInputElement).value;
  numValue.value = +(currentNum ?? 0);
};
</script>
<style scoped></style>
