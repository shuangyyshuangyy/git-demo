<template>
  <div
    class="w-full px-4 h-20 flex items-center text-white bg-black-50 border-black-border border justify-between relative"
  >
    <div class="mx-6">
      <NavMenu />
    </div>
    <div
      class="absolute left-1/2 -translate-x-1/2 flex justify-center items-center"
    >
      <ShapeMenus :title="'添加元素'" :menus="addSingleResList" />
      <div class="bg-black-border h-12 w-[1px] ml-10 mr-11"></div>
      <div class="grid grid-cols-4">
        <ShapeMenus :title="'背景与刻度'" :menus="addPluginList" />
        <ShapeMenus :title="'时间'" :menus="addPluginList" />
        <ShapeMenus :title="'日期'" :menus="addPluginList" />
        <ShapeMenus :title="'小部件'" :menus="addPluginList" />
      </div>
      <div class="bg-black-border h-12 w-[1px] ml-11 mr-10"></div>
      <ShapeMenus :title="'使用模板'" :menus="addPluginList" />
    </div>
    <!-- right actions -->
    <div class="flex-shrink-0">
      <a-button @click="() => {}" class="mr-2"> 导出 </a-button>
      <a-button
        @click="saveWatchfaceData"
        :disabled="watchfaceSaving"
        :loading="watchfaceSaving"
      >
        保存
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShapeManage, useWatchfaceManage, watchfaceSaving } from '@/hooks';
import { useSelectStore } from '@/store/use-select-store';
import { Shape, ShapeType } from '@/services/shape';

const { saveWatchfaceData } = useWatchfaceManage();

const { pickShapeImage } = useShapeManage();
const selectStore = useSelectStore();

const addResource = ({
  type,
  attrs = {}
}: {
  type: ShapeType;
  attrs?: Shape['attrs'];
}) => {
  const theme = selectStore.theme;
  if (!theme) return;
  const shape = Shape.create(theme, type, attrs);
  selectStore.select([shape?.id || '']);
  return shape;
};

const addImage = async () => {
  // 选择图片
  const imagePath = await pickShapeImage();
  if (!imagePath) return;
  const shape = addResource({ type: ShapeType.Image });
  // 设置图片资源
  await shape?.setResources(
    {
      resourceName: 'pointer0',
      colorGroup: selectStore.themeColorId,
      realpath: imagePath
    },
    true
  );
};
const addSingleResList = ref<DropDownMenuItem[]>([
  {
    icon: 'shape-text.svg',
    title: '文本',
    shortcuts: ['T'],
    onClick: () => {
      addResource({ type: ShapeType.Text });
    }
  },
  {
    icon: 'shape-image.svg',
    title: '图片',
    shortcuts: ['Shift', 'CommandOrControl', 'K'],
    onClick: () => {
      addImage();
    }
  },
  {
    icon: 'shape-images.svg',
    title: '图组',
    shortcuts: ['Shift', 'K'],
    onClick: () => {
      addResource({ type: ShapeType.ImageArray });
    }
  },
  {
    icon: 'shape-progress.svg',
    shortcuts: ['P'],
    title: '进度条',
    onClick: () => {
      addResource({ type: ShapeType.ProgressBar });
    }
  },
  {
    delimiter: '特殊'
  },
  {
    icon: 'shape-circle.svg',
    title: '动画序列帧',
    disabled: true,
    onClick: () => {
      addResource({ type: ShapeType.ProgressBar });
    }
  },
  {
    icon: 'shape-circle.svg',
    title: '应用小部件',
    disabled: true,
    onClick: () => {
      addResource({ type: ShapeType.ProgressBar });
    }
  },
  {
    icon: 'shape-circle.svg',
    title: '相册表盘背景',
    disabled: true,
    onClick: () => {
      addResource({ type: ShapeType.ProgressBar });
    }
  }
]);

const addPluginList = ref<DropDownMenuItem[]>([
  {
    title: '自定义指针',
    onClick: () => {
      addResource({ type: ShapeType.ThreePointers });
    }
  }
]);
</script>

<style scoped></style>
