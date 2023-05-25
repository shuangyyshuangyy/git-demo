<template>
  <AttrSectionTitle
    title="指针阴影"
    :status="show"
    @change="(status: boolean)=> show=status"
  />
  <div v-if="show" class="py-3">
    <ImagePicker
      :img="pointerShadow"
      @change="(image: string) => emits('onImageUpdate',image, 'pointerShadow' )"
      @delete="() => emits('delete', 'pointerShadow')"
    />
    <div class="my-2 flex items-center">
      <span>指针阴影Y轴偏移量：</span>
      <div>
        <a-input-number
          class="flex-1 ml-2 bg-transparent"
          placeholder="请输入"
          :defaultValue="curShape.attrs.shadowPointerOffsetY ?? 0"
          @change="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { Shape } from '@/services/shape';
import { useSelectStore } from '@/store/use-select-store';

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const emits = defineEmits<{
  (event: 'onImageUpdate', image: string, resourceName: string): void;
  (event: 'delete', resourceName: string): void;
}>();

const selectStore = useSelectStore();

const pointerShadow = computed(
  () =>
    props.curShape.getResources({
      resourceName: 'pointerShadow',
      colorGroup: selectStore.themeColorId,
      base64: true
    })?.[0]
);

const show = ref(!!pointerShadow.value);

const onChange = (val: number) => {
  props.curShape.setAttrs({ shadowPointerOffsetY: val });
};
</script>
