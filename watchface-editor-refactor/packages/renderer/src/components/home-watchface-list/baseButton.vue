<template>
  <div
    class="flex-row content-center items-center text-center border border-white rounded mx-[20px] w-[100px] h-[30px] hover:bg-white hover:text-gray-700"
    @click="onSubmit"
  >
    <div>{{ props.initialContent }}</div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  initialContent: {
    type: String,
    default: '确定'
  }
});
const emits = defineEmits<{
  (event: 'submit', value: string): void;
}>();

const onSubmit = (event: any) => {
  emits('submit', event.target.value);
};
</script>
