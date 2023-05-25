<template>
  <div class="bg-re1d-200">
    <template v-if="editMode">
      <div class="h-full py-[2px] relative">
        <input
          ref="input"
          v-model="inputVal"
          :spellcheck="false"
          autofocus
          class="h-full w-full border border-white border-solid bg-transparent outline-none text-normal"
          :class="{
            'border-red-400': !!err
          }"
          @keyup.enter="submitAndClose"
          @blur="submitAndClose"
          @input="_valid"
        />
      </div>
      <div v-if="!!err" class="absolute -bottom-5">
        <small class="text-red-400">{{ err }}</small>
      </div>
    </template>
    <template v-else>
      <span
        class="overflow-hidden flex items-center h-full text-ellipsis max-w-[180px] whitespace-nowrap"
        :class="{
          'justify-center': center
        }"
        @dblclick="() => startEditMode()"
        >{{ title }}</span
      >
    </template>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, PropType, ref, watch } from 'vue';

const props = defineProps({
  treeId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  submit: {
    type: Function as PropType<(treeId: string, value: string) => void>,
    default: () => ({})
  },
  valid: {
    type: Function as PropType<
      (treeId: string, value: string) => string | undefined
    >,
    default: undefined
  },
  center: {
    type: Boolean,
    default: false
  },
  editKey: {
    type: Number,
    default: 0
  }
});

// input
const input = ref<HTMLInputElement>();
const inputVal = ref(props.title);
const editMode = ref(false);

const emits = defineEmits<{
  (event: 'valid', treeId: string, valid: boolean): void;
}>();

// error
const err = ref('');
watch(err, () => {
  const valid = !err.value;
  emits('valid', props.treeId, valid);
});

const _valid = () => {
  const errMsg = props.valid?.(props.treeId, inputVal.value) ?? '';
  err.value = errMsg;
  const valid = !errMsg;
  return valid;
};

const submitAndClose = () => {
  // 验证名称
  if (_valid()) {
    // 验证通过修改
    props.submit?.(props.treeId, inputVal.value);
  }
  // 关闭编辑模式
  editMode.value = false;
  err.value = '';
};

watch(
  () => props.editKey,
  (val) => {
    if (val > 0) startEditMode();
    if (val < 0) submitAndClose();
  }
);

watch(
  () => props.title,
  () => {
    inputVal.value = props.title;
  }
);

const startEditMode = async () => {
  err.value = '';
  editMode.value = true;
  inputVal.value = props.title;
  await nextTick();
  // inputVal.value = data.title;
  input.value?.focus();
};
</script>
