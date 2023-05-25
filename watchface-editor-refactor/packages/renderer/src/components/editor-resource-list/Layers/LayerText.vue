<template>
  <div class="flex-grow flex-shrink flex items-center select-none mr-2 w-0">
    <input
      ref="inputRef"
      v-show="showInput"
      autocorrect="off"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      :value="text"
      type="text"
      :class="['palette-' + palette]"
      class="h-[29px] bg-black-50 mr-[3px] flex-grow border-[1px] border-black outline-none pl-[5px] leading-[12px] mt-[-1px]"
      @focus="focus"
      @blur="blur"
      @keyup="keyup"
    />
    <div
      class="px-[6px] flex-grow flex-shrink whitespace-nowrap overflow-ellipsis overflow-hidden"
      @dblclick="edit"
      v-show="!showInput"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    palette?: 'red' | 'blue';
  }>(),
  {
    text: '图层名',
    palette: 'blue'
  }
);

const emit = defineEmits<{
  (event: 'submit', value: string): void;
}>();

const inputRef = ref<HTMLInputElement>();
const showInput = ref(false);

function edit() {
  showInput.value = true;

  nextTick(() => {
    inputRef.value?.focus();
  });
}

function focus() {
  inputRef.value?.setSelectionRange(0, inputRef.value.value.length);
}

function blur() {
  if (inputRef.value?.value) {
    emit('submit', inputRef.value.value);
  }

  setTimeout(() => {
    showInput.value = false;
  }, 20);
}

function keyup(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    inputRef.value?.blur();
  }
}

defineExpose({
  edit,
  showInput
});
</script>

<style scoped>
.palette-blue::selection {
  color: #c2ddfb;
  background: #314b68;
}

.palette-red::selection {
  color: #ff5e20;
  background: #58382b;
}
</style>
