<template>
  <div>
    <template v-if="imageIndexs.length <= 30">
      <div class="flex justify-end text-xs my-4">
        <div class="cursor-pointer" @click="onUploadBatch">批量上传</div>
        <div class="ml-4 cursor-pointer" @click="onDeleteAll">全部删除</div>
      </div>

      <!-- 图片列表 -->
      <div class="grid grid-cols-6 text-xs gap-2">
        <div v-for="item in imageIndexs" :key="item.index">
          <div class="flex items-center flex-col">
            <ImagePicker
              :img="images[item.index]"
              @change="(image:string)=>uploadImage(image,item.index)"
              :deletable="false"
            />
            <div class="text-center mt-1">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </template>

    <div v-else>该数据项无法使用’普通填充‘属性，请使用数字类填充。</div>
    <!-- <div v-if="props.selectType == 'digits'" class="text-xs">
      <div class="flex justify-between items-center mb-4">
        <div class="flex-1 mr-4">
          <div class="mb-1">格式</div>
          <BaseSelect
            v-model:value="dateType"
            :data="dateTypeList"
            @select="setDateType"
          ></BaseSelect>
        </div>
        <div>
          <div class="mb-1">单位(可选)</div>
          <ImagePicker
            :img="unitIcons[0]"
            @change="(image: string) => onUnitUpdate(image,0)"
          ></ImagePicker>
        </div>
      </div>
      <div v-if="dateType == 'type3' || dateType == 'type4'">
        <div class="mb-1">小数点</div>
        <ImagePicker
          :img="decimalIcons[0]"
          @change="(image: string) => onDecimalUpdate(image,0)"
        ></ImagePicker>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { useDataSource } from '@/hooks';
import { Shape } from '@/services/shape';
import { ImageArrayAttribute } from '@/services/shape/attributes/image-array';
import { useImagesStore } from '@/store/use-images-store';
import { useSelectStore } from '@/store/use-select-store';
import { pickFile } from '@/utils/fs/pick-file.utils';
import { Modal } from 'ant-design-vue';
import { watch } from 'vue';
import { computed, PropType, ref } from 'vue';

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});

const selectStore = useSelectStore();
const { findOne } = useDataSource();

const sourceItem = computed(() => {
  const source = props.curShape.attrs.source;
  return source ? findOne(source) : undefined;
});

//初始化图组循环列表
const imageIndexs = computed(() => {
  const res: { index: number; label: string }[] = [];
  if (props.curShape.attrs.fillType == '数字填充') {
    for (let i = 0; i <= 11; i++) {
      res.push({
        index: i,
        label: i == 10 ? '-' : i == 11 ? '.' : i + ''
      });
    }
  } else {
    const min = sourceItem.value?.minValue ?? 0;
    const max = sourceItem.value?.maxValue ?? 0;
    // 无论数据源是否从0开始，数组都从0开始
    for (let i = 0; i <= max - min; i++) {
      res.push({
        index: i,
        label: i + min + ''
      });
    }
  }
  return res;
});

watch(imageIndexs, () => {
  if (imageIndexs.value.length > 30) {
    Modal.warning({
      title: '该数据项无法使用’普通填充‘属性，请使用数字类填充。',
      okText: '好的'
    });
  }
});

const images = computed(() => {
  return props.curShape.getResources({
    resourceName: 'images',
    colorGroup: selectStore.themeColorId,
    base64: true
  });
});

const uploadImage = async (realpath: string, index: number) => {
  await props.curShape.setResources({
    resourceName: 'images',
    colorGroup: selectStore.themeColorId,
    realpath,
    index
  });
};

// 批量上传
const onUploadBatch = async () => {
  // 选择图片
  const images = (await pickFile({
    extensions: ['png'],
    multi: true
  })) as string[];
  if (!images?.length) return;
  // 重新排序
  images.sort();
  for (const item of imageIndexs.value) {
    const { index } = item;
    const realpath = images[index];
    if (realpath) await uploadImage(realpath, index);
  }
};

// 全部删除
const onDeleteAll = () => {
  props.curShape.deleteResource({
    resourceName: 'images',
    colorGroup: selectStore.themeColorId
  });
};

// const dateType = ref('type1');
// const dateTypeList = [
//   { label: '格式1(8)', value: 'type1' },
//   { label: '格式2(08)', value: 'type2' },
//   { label: '格式3(8.0)', value: 'type3' },
//   { label: '格式4(08.8)', value: 'type4' }
// ];
// const setDateType = (item: BaseSelectItem) => {};
// const imagesStore = useImagesStore();
// const selectStore = useSelectStore();
// const shapeAttr = computed(() => props.curShape.attrs as ImageArrayAttribute);

// const unitIcons = ref(
//   (shapeAttr.value.unitIcon
//     ? shapeAttr.value.unitIcon[useSelectStore().themeColorId] || []
//     : []
//   ).map((src) => {
//     return imagesStore.getImgs([src])?.[0]?.value ?? '';
//   })
// );

// const decimalIcons = ref(
//   (shapeAttr.value.decimalIcon
//     ? shapeAttr.value.decimalIcon[useSelectStore().themeColorId] || []
//     : []
//   ).map((src) => {
//     return imagesStore.getImgs([src])?.[0]?.value ?? '';
//   })
// );

// const onImageUpdate = async (image: string, index: number) => {
//   const resName = props.curName;
//   const curShape = Shape.getShape(resName);
//   await curShape?.setResources(
//     {
//       resourceName: 'images',
//       colorGroup: selectStore.themeColorId,
//       realpath: image,
//       index
//     },
//     true
//   );
// };

// const onUnitUpdate = async (image: string, index: number) => {
//   const resName = props.curName;
//   const curShape = Shape.getShape(resName);
//   await curShape?.setResources({
//     resourceName: 'unitIcon',
//     colorGroup: selectStore.themeColorId,
//     realpath: image
//   });
// };

// const onDecimalUpdate = async (image: string, index: number) => {
//   const resName = props.curName;
//   const curShape = Shape.getShape(resName);
//   await curShape?.setResources({
//     resourceName: 'decimalIcon',
//     colorGroup: selectStore.themeColorId,
//     realpath: image
//   });
// };
</script>
