<template>
  <drop-down :menus="menus">
    <icon icon="nav.svg" :width="30" :height="30" />
  </drop-down>

  <watchface-create-modal ref="createModalRef" />
  <ConfirmSaveModal ref="confirmSaveModal" />
</template>

<script setup lang="ts">
import { useSnapshot } from '@/hooks/use-snapshot';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
// import { ElectronApi } from '@/services/electron.api';
import { useWatchfaceManage, useWatchfaceStatus } from '@/hooks';

const router = useRouter();
const { undo, redo, history } = useSnapshot();
const { status } = useWatchfaceStatus();
const { pickAndOpenWatchfaceFile, saveWatchfaceData } = useWatchfaceManage();

const createModalRef = ref();
const confirmSaveModal = ref();
const menus = computed(() => {
  const { index = 0, max = 0, min = 0 } = history.value ?? {};
  const menus: DropDownMenuItem[] = [
    // {
    //   title: '返回首页',
    //   onClick: () => {
    //     confirmSaveIfNeed(() => router.replace('home'));
    //   }
    // },
    {
      title: '新建',
      onClick: () => {
        createModalRef.value?.open?.();
      }
    },
    {
      title: '打开',
      onClick: () => pickAndOpenWatchfaceFile()
    },
    {
      title: '保存',
      onClick: () => saveWatchfaceData(),
      shortcuts: ['CommandOrControl', 'S']
    },
    {
      title: '撤销',
      disabled: index <= min,
      onClick: () => undo(),
      shortcuts: ['CommandOrControl', 'Z']
    },
    {
      title: '取消撤销',
      disabled: index >= max,
      onClick: () => redo(),
      shortcuts: ['Shift', 'CommandOrControl', 'Z']
    },
    {
      delimiter: true
    },
    {
      title: '导出',
      onClick: () => {
        console.log('导出');
      }
    },
    {
      title: '下载至手机',
      onClick: () => {
        console.log('todo');
      }
    },
    {
      title: '关闭',
      onClick: () => {
        if (status.value == 'unsaved') {
          confirmSaveModal.value?.open?.();
        } else {
          router.replace('home');
        }
      }
    }
  ];
  return menus;
});
</script>
