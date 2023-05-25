<template>
  <AttrSectionTitle
    title="指针光源"
    :status="show"
    @change="(status: boolean)=>show=status"
  >
    <div class="w-[90px]">
      <BaseSelect
        :value="curShape.attrs.lightPointerType ?? 'none'"
        :data="sourceList"
        @select="setPointerType"
      />
    </div>
  </AttrSectionTitle>

  <template v-if="show">
    <div class="mt-6 flex justify-center">
      <!-- 四象限 -->
      <div
        class="flex flex-wrap w-[162px] h-40 bg-blcak-50 rounded-full border-black-border border-[1px]"
        v-if="curShape.attrs.lightPointerType == 'four'"
      >
        <div
          class="w-20 h-20 pt-8 pl-8 border-r-[1px] border-b-[1px] border-black-border"
        >
          <ImagePicker
            :img="pointers[0]"
            :border="false"
            @change="(image: string) => onImageUpdate(image,'pointer0')"
            @delete="() => emits('delete', 'pointer0')"
          />
        </div>
        <div
          class="w-20 h-20 pt-8 pl-2 border-l-[1px] border-b-[1px] border-black-border"
        >
          <ImagePicker
            :img="pointers[1]"
            :border="false"
            @change="(image: string) => onImageUpdate(image,'pointer1')"
            @delete="() => emits('delete', 'pointer1')"
          />
        </div>
        <div
          class="w-20 h-20 pt-2 pl-8 border-r-[1px] border-t-[1px] border-black-border"
        >
          <ImagePicker
            :img="pointers[2]"
            :border="false"
            @change="(image: string) => onImageUpdate(image,'pointer2')"
            @delete="() => emits('delete', 'pointer2')"
          />
        </div>
        <div
          class="w-20 h-20 pt-2 pl-2 border-l-[1px] border-t-[1px] border-black-border"
        >
          <ImagePicker
            :img="pointers[3]"
            :border="false"
            @change="(image: string) => onImageUpdate(image,'pointer3')"
            @delete="() => emits('delete', 'pointer3')"
          />
        </div>
      </div>
      <!-- 二象限 -->
      <div
        class="flex flex-wrap w-[162px] h-40 bg-black-50 rounded-full border-black-border border-[1px]"
        v-if="curShape.attrs.lightPointerType == 'two'"
      >
        <div
          class="w-20 h-40 flex justify-center items-center border-r-[1px] border-black-border"
        >
          <ImagePicker
            class="!h-32"
            :img="pointers[0]"
            :border="false"
            @change="(image: string) => onImageUpdate(image,'pointer0')"
            @delete="() => emits('delete', 'pointer0')"
          />
        </div>
        <div
          class="w-20 h-40 flex justify-center items-center border-l-[1px] border-black-border"
        >
          <ImagePicker
            class="!h-32"
            :img="pointers[1]"
            :border="false"
            @change="(image: string) => onImageUpdate(image,'pointer1')"
            @delete="() => emits('delete', 'pointer1')"
          />
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { useSelectStore } from '@/store/use-select-store';
import { ref } from 'vue';
import { computed, PropType } from 'vue';

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const sourceList = [
  { label: '无', value: 'none' },
  { label: '两象限', value: 'two' },
  { label: '四象限', value: 'four' }
];

const setPointerType = (item: BaseSelectItem) => {
  const val = item.value as 'none';
  props.curShape.setAttrs({ lightPointerType: val });
  if (val !== 'none') show.value = true;
};

const selectStore = useSelectStore();

const pointers = computed(() => {
  const _pointers: string[] = [];
  const shape = props.curShape;
  ['pointer0', 'pointer1', 'pointer2', 'pointer3'].forEach((resourceName) => {
    const img = shape.getResources({
      resourceName,
      colorGroup: selectStore.themeColorId,
      base64: true
    })?.[0];
    _pointers.push(img);
  });

  return _pointers;
});

const onImageUpdate = async (image: string, attrName: string) => {
  emits('onImageUpdate', image, attrName);
};

const emits = defineEmits<{
  (event: 'onImageUpdate', image: string, resourceName: string): void;
  (event: 'delete', resourceName: string): void;
}>();

const show = ref(props.curShape.attrs.lightPointerType != 'none');
</script>
