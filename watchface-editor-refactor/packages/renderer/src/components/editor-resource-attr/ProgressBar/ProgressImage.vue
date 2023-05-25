<template>
  <div class="px-4">
    <div class="font-semibold text-white">填充</div>
    <div v-for="item in images" :key="item.resourceName">
      <div class="my-3 text-[#979797]">{{ item.label }}</div>

      <div class="flex items-center">
        <ImagePicker
          :img="item.base64"
          @change="(image: string) => onImageUpdate(item.resourceName, image)"
          @delete="() => deleteImage(item.resourceName)"
        />
        <span class="ml-4">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElectronApi } from '@/services/electron.api';
import { Shape } from '@/services/shape';
import { useImagesStore } from '@/store/use-images-store';
import { useSelectStore } from '@/store/use-select-store';
import { computed } from 'vue';
import { PropType } from 'vue';

const selectStore = useSelectStore();
const imageStore = useImagesStore();

const props = defineProps({
  shape: {
    type: Object as PropType<Shape>,
    required: true
  }
});

const images = computed(() => {
  const _images: {
    label: string;
    resourceName: 'progress' | 'bg';
    base64?: string;
    name?: string;
  }[] = [
    { label: '进度条', resourceName: 'progress' },
    { label: '进度条背景', resourceName: 'bg' }
  ];

  _images.forEach((item) => {
    const src = props.shape?.getResources({
      resourceName: item.resourceName ?? '',
      colorGroup: selectStore.themeColorId
    })?.[0];

    const image = imageStore.image(src);
    item.base64 = image?.value ?? '';
    item.name = ElectronApi.path?.basename(image?.realpath ?? '');
  });

  return _images;
});

const onImageUpdate = async (
  resourceName: (typeof images.value)[0]['resourceName'],
  image: string
) => {
  await props.shape.setResources({
    resourceName,
    colorGroup: selectStore.themeColorId,
    realpath: image
  });
};

const deleteImage = (resourceName: string) => {
  props.shape.deleteResource({
    resourceName,
    colorGroup: selectStore.themeColorId
  });
};
</script>
