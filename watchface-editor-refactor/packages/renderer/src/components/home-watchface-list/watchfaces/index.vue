<template>
  <div class="relative w-[100%]">
    <div class="flex justify-end mr-[60px] mt-[20px]">
      <div
        @click.stop="selectWatchface"
        :class="{ 'text-[#FFA552]': selectObj.clickState === true }"
      >
        <span class="mr-[12px]">筛选</span>
      </div>
      <div>
        <Icon
          icon="ButtonUnselect.svg"
          :width="16"
          :height="18"
          v-if="!selectObj.clickState"
        />
        <Icon icon="Buttonselect.svg" :width="16" :height="18" v-else />
      </div>
      <select-window
        v-if="selectObj.selectWindow"
        @close-select-window="closeSelectWindow"
        @finish-select="finishSelect"
      ></select-window>
    </div>
    <div class="pr-2 mt-6 ml-9 _grid pb-6" v-if="watchfaceList.length > 0">
      <div v-for="(item, key) in watchfaceList" :key="key">
        <DropDown :trigger="'contextmenu'" :menus="contextmenus(item.path)">
          <watchfaceItem
            :device-type="item.devciceType"
            :title="item.title ?? ''"
            :pic="item.preview"
            :path="item.path"
            :last-opened="item.lastOpend"
            :collect="item.collect"
            @open-watchface="openWatchface"
            @open-suspend-window="openSuspendWindow"
            @change-collect="changeCollect"
          />
        </DropDown>
      </div>
    </div>
    <div class="flex justify-center items-center h-[100%] mt-[-10vh]" v-else>
      <div>{{ guideContent }}</div>
    </div>
  </div>
  <!-- <div>
    <suspend-window
      :left="modelLeft"
      :top="modelTop"
      :path="curPath"
      @open-watchface="openWatchface"
      @remove-watchface="removeWatchface"
      @open-path="openPath"
      @change-collect="changeCollect"
      v-if="refModel"
    ></suspend-window>
  </div> -->
</template>
<script setup lang="ts">
import { useWatchfaceHistory } from '@/hooks/use-watchface-history';
import { useWatchfaceManage } from '@/hooks/use-watchface-manage';
import { validWatchfacePath } from '@/utils/watchface-valid.utils';
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue';
import { ElectronApi } from '@/services/electron.api';

const props = defineProps({
  initialType: {
    type: Number,
    default: 0 //标记是否收藏页面
  }
});
const emits = defineEmits<{
  (event: 'updateWatchface', path: string): void;
}>();
const {
  historyData: watchfaces,
  deleteFromStorage,
  updateItem
} = useWatchfaceHistory();
const { openNewWatchface } = useWatchfaceManage();

let guideContent = '无最近打开表盘';
const watchfaceList = computed(() => {
  if (props.initialType == 1) {
    guideContent = '无收藏表盘';
    if (selectObj.IsHasSelectCondation) {
      return watchfaces.value.filter(
        (item) =>
          item.collect == true && selectionCondation.has(item.devciceType)
      );
    }
    return watchfaces.value.filter((item) => item.collect == true);
  } else {
    guideContent = '无最近打开表盘';
    if (selectObj.IsHasSelectCondation) {
      return watchfaces.value.filter((item) =>
        selectionCondation.has(item.devciceType)
      );
    }
    return watchfaces.value;
  }
});

const openWatchface = async (path: string) => {
  try {
    let valid = await validWatchfacePath(path); //验证资源的合法性
    if (!valid) {
      alert('无法打开文件，因为文件已经被移除或移动');
      deleteFromStorage(path); //path不合法 删除项目的缓存
      return;
    }
    await openNewWatchface(path); //根据path初始化表盘
  } catch (error) {
    console.log(error);
  }
};

const modelTop = ref('0px');
const modelLeft = ref('0px');
const refModel = ref(false);
const curPath = ref('');
const openSuspendWindow = (
  open: boolean,
  left: string,
  top: string,
  path: string
) => {
  if (refModel.value) refModel.value = false;
  // refModel.value = true;
  nextTick(() => {
    curPath.value = path;
    modelLeft.value = left;
    modelTop.value = top;
  });
};

const contextmenus = (path: string) => {
  const res: DropDownMenuItem[] = [
    { title: '打开', onClick: () => openWatchface(path) },
    { delimiter: true },
    {
      title: '创建副本-todo',
      onClick: () => {
        alert('TODO');
      }
    },
    { title: '打开文件所在位置', onClick: () => openPath(path) },
    { delimiter: true },
    {
      title: '编辑表盘信息',
      onClick: () => {
        updateWatchface(path);
      }
    },
    {
      title: '收藏',
      onClick: () => {
        changeCollect(path, true);
      }
    },
    { delimiter: true },
    {
      title: '从列表移除',
      onClick: () => {
        removeWatchface(path);
      }
    }
  ];
  return res;
};

//添加点击关闭
document.addEventListener('click', (event) => {
  if (selectObj.selectWindow) closeSelectWindow();
});
onUnmounted(() => {
  document.removeEventListener('click', () => {
    console.log('remove');
  });
});

const removeWatchface = (path: string) => {
  deleteFromStorage(path);
};
const openPath = (path: string) => {
  ElectronApi.shell?.showItemInFolder(path);
};
const updateWatchface = (path: string) => {
  emits('updateWatchface', path);
};
const changeCollect = (path: string, collect: boolean) => {
  updateItem(path, { collect });
};

const selectObj = reactive({
  clickState: false,
  selectWindow: false,
  IsHasSelectCondation: false
});
const selectionCondation = new Map();

const selectWatchface = () => {
  //筛选框
  if (selectObj.clickState) {
    selectObj.clickState = false;
    selectObj.selectWindow = false;
    selectObj.IsHasSelectCondation = false;
    selectionCondation.clear();
  } else {
    selectObj.clickState = true;
    selectObj.selectWindow = true;
  }
};
const closeSelectWindow = () => {
  if (!selectObj.IsHasSelectCondation) {
    selectObj.clickState = false;
    selectObj.selectWindow = false;
  }
};
const finishSelect = (selection: Array<string>) => {
  if (selection.length > 0) selectObj.IsHasSelectCondation = true;
  for (let i = 0; i < selection.length; i++) {
    selectionCondation.set(selection[i], 1);
  }
  selectObj.selectWindow = false;
};
</script>

<style scoped>
._grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  column-gap: 25px;
  row-gap: 20px;
}
</style>
