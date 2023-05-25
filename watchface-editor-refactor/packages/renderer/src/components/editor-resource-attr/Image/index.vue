<template>
  <a-collapse v-model:activeKey="activeKey" ghost>
    <a-collapse-panel key="1" header="填充">
      <div class="px-[10px]">
        <div class="my-2">
          <ImagePicker
            :img="pointer0"
            @change="(image: string) => onImageUpdate(image,'pointer0')"
            @delete="() => onImageDelete('pointer0')"
          />
        </div>

        <!-- 指针光源 -->
        <div class="mt-6">
          <LightSource
            :cur-shape="props.curShape"
            @onImageUpdate="onImageUpdate"
            @delete="onImageDelete"
          />
        </div>
        <!-- 显示投影 -->
        <div class="mt-6">
          <ShadowPointer
            :cur-shape="props.curShape"
            @onImageUpdate="onImageUpdate"
            @delete="onImageDelete"
          />
        </div>
      </div>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="效果">
      <template #extra>
        <div @click.stop="">
          <AttrAddSubtrackIcon :status="showSource" @change="onShowToggle" />
        </div>
      </template>
      <!-- 数据源 -->
      <data-source2
        attr="旋转"
        :source="curShape.attrs.source"
        @change="setAttrs"
      />
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
import { PropType, ref, computed } from 'vue';
import { Shape } from '@/services/shape';
import { ImageAttribute } from '@/services/shape/attributes/image';
import { useSelectStore } from '@/store/use-select-store';

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    required: true
  }
});

const selectStore = useSelectStore();

const activeKey = ref(['1']);

const pointer0 = computed(() => {
  const _pointer0 = props.curShape.getResources({
    resourceName: 'pointer0',
    colorGroup: selectStore.themeColorId,
    base64: true
  });
  return _pointer0?.[0] ?? '';
});

const onImageUpdate = async (image: string, resourceName: string) => {
  props.curShape?.setResources({
    resourceName,
    colorGroup: selectStore.themeColorId,
    realpath: image
  });
};

const onImageDelete = async (resourceName: string) => {
  props.curShape?.deleteResource({
    resourceName,
    colorGroup: selectStore.themeColorId
  });
};

const setAttrs = (data: Partial<ImageAttribute>) => {
  props.curShape.setAttrs(data);
  if (Object.keys(data).includes('source')) {
    const val = data.source;
    if (val) {
      if (!activeKey.value.includes('2')) activeKey.value.push('2');
    } else {
      activeKey.value = activeKey.value.filter((key) => key !== '2');
    }
  }
};

const showSource = ref(!!props.curShape.attrs.source);

const onShowToggle = (status: boolean) => {
  showSource.value = status;
  if (status) {
    if (!activeKey.value.includes('2')) activeKey.value.push('2');
  } else {
    setAttrs({
      source: ''
    });
  }
};
</script>
