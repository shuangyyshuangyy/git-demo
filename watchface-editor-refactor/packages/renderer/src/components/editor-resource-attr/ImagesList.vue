<template>
  <div
    class="bg-black h-[27px] px-2 flex items-center"
    @click="ImageUpload = !ImageUpload"
  >
    <Icon icon="PolygonBottom.svg" :width="6" :height="6" v-if="ImageUpload" />
    <Icon icon="PolygonRight.svg" :width="6" :height="6" v-else />
    <span class="text-xs ml-2">填充</span>
  </div>
  <div v-if="ImageUpload" class="px-4">
    <div class="flex justify-between mt-4">
      <span class="text-xl">添加图片</span>
      <div class="text-base">
        <span class="mr-2">批量上传</span>
        <span>全部删除</span>
      </div>
    </div>
    <div class="flex mt-4">
      <div class="w-24 h-24 p-2" v-for="(img, index) in images" :key="index">
        <ImagePicker
          :img="img"
          @change="(img: string) => onImageUpdate({ index, img })"
        ></ImagePicker>
      </div>
      <div class="w-24 h-24 p-2">
        <ImagePicker
          :img="imgBase64"
          @change="(img: string) => onImageUpload(img)"
        ></ImagePicker>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue';
//import ImagePicker from './ImagePicker.vue';
const props = defineProps({
  images: {
    type: Array<string>,
    default: []
  }
});
const ImageUpload = ref(false);
const emits = defineEmits<{
  (e: 'update', { index, img }: { index: number; img: string }): void;
}>();

const onImageUpdate = ({
  index,
  img
}: {
  index: number;
  img: string;
}): void => {
  emits('update', { index, img });
};
const imgBase64 = ref('');
const onImageUpload = (img: any) => {
  let index = props.images.length;
  emits('update', { index, img });
};
</script>
