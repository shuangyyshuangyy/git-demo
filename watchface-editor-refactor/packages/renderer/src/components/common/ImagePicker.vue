<template>
  <div
    class="relative w-10 h-10 overflow-hidden rounded cursor-pointer"
    :style="{
      border: props.border ? '1px solid #B7B7B7' : ''
    }"
    @click="inputRef?.click()"
  >
    <!-- 存在图片时 -->
    <img
      class="object-contain w-full h-full p-[1px]"
      :src="imgBase64"
      v-if="imgBase64"
    />
    <!-- 不存在图片时 显示添加按钮 -->
    <div v-else class="h-full w-full flex justify-center items-center">
      <icon icon="upload.svg" :width="16" :height="16" fill="none" />
    </div>
    <input
      ref="inputRef"
      type="file"
      class="relative -top-10 opacity-0 cursor-pointer"
      style="display: none"
      accept="image/*"
      @change="onFileChange"
    />
    <!-- 图片删除icon -->
    <div
      v-if="deletable && imgBase64"
      class="absolute -top-[7px] right-[0px]"
      @click.stop="onDelete"
    >
      <icon icon="img_delete.svg" :width="10" :height="10" fill="none" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  img: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: true
  },
  deletable: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits<{
  (e: 'change', img: string): void;
  (e: 'delete'): void;
}>();
const inputRef = ref<HTMLInputElement>();

const imgBase64 = ref('');

watch(
  () => props.img,
  (newVal) => {
    imgBase64.value = newVal;
  },
  {
    immediate: true
  }
);

const onFileChange = (e: Event) => {
  const files = inputRef.value?.files;
  if (!files || !files.length) return;
  emit('change', files[0].path);
};

const onDelete = () => {
  emit('delete');
};
</script>
