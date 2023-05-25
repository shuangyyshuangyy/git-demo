<template>
  <div class="flex-col content-center">
    <input
      type="text"
      :value="initialInput"
      @change="(e) => onChange(e)"
      class="border-[#454545] border rounded bg-[#2E2E2E] w-[250px] h-[30px] text-[18px] pl-[5px]"
    />
    <div>
      <span class="text-xs text-red-700">{{ guideContent }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialInput: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  guideContent: {
    type: String,
    default: '内容不能为空'
  }
});
let guideContent = ref('');
const emits = defineEmits<{
  (event: 'changeValue', value: string): void;
}>();

//规则验证
const checkValidity = (content: string) => {
  if (!content) {
    guideContent.value = '内容不能为空';
    return false;
  } else if (content.length > 40) {
    guideContent.value = '长度不能大于40';
    return false;
  } else {
    guideContent.value = '';
    return true;
  }
};
const onChange = (event: any) => {
  checkValidity(event.target.value);
  emits('changeValue', event.target.value);
};
const checkInput = () => {
  return checkValidity(props.initialInput);
};
const guideCancel = () => {
  guideContent.value = '';
  return true;
};
defineExpose({ checkInput, guideCancel });
</script>
