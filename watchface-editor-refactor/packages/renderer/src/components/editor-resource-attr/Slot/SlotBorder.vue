<template>
  <div class="px-[10px] py-2">
    <div class="flex justify-center items-center">
      <div class="w-[200px] y-[200px] relative">
        <Icon icon="watchfaceBorder.svg" :width="200" :height="200" />
        <div
          class="absolute top-0 left-0"
          :style="{
            top: imgTop + 'px',
            left: imgLeft + 'px'
          }"
        >
          <img class="w-10 h-10" :src="img" />
        </div>
      </div>
    </div>
    <div class="my-3">边框</div>
    <ImagePicker
      :img="img"
      @change="(image: string) => onImageUpdate(image)"
    ></ImagePicker>
  </div>
</template>
<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { useImagesStore } from '@/store/use-images-store';
import { PropType, ref } from 'vue';

const props = defineProps({
  curName: {
    type: String,
    default: ''
  },
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const IsFold = ref(true);

const imagesStore = useImagesStore();
const img = ref();

//设置图片在缩略图的相对位置
const imgLeft = ref((props.curShape.attrs.x ?? 0) * 0.4 || 0);
const imgTop = ref((props.curShape.attrs.y ?? 0) * 0.4 || 0);

const onImageUpdate = async (image: string) => {
  const resName = props.curName;
  const curShape = Shape.getShape(resName);
  if (!curShape) return;
};
</script>
