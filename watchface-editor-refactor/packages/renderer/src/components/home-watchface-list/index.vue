<template>
  <div>
    <div class="flex h-[calc(100vh-48px)] realtive">
      <div
        class="w-[320px] bg-black-50 divide-y border border-black-border px-[12px] pt-[20px]"
      >
        <div class=" ">
          <div
            class="h-[60px] px-[20px] rounded hover:bg-[#484848] flex items-center"
            :class="{
              'bg-[#484848]': activeMenu == 0
            }"
            @click="activeMenu = 0"
          >
            最近打开
          </div>
          <div
            class="h-[60px] px-[20px] hover:bg-[#484848] rounded flex items-center mb-[10px]"
            :class="{
              'bg-[#484848]': activeMenu == 1
            }"
            @click="activeMenu = 1"
          >
            我的收藏
          </div>
        </div>
        <div class="mx-5 pt-4">
          <a-button class="w-full" @click="create"> 新建 </a-button>
          <a-button
            class="w-full mt-3"
            @click="() => pickAndOpenWatchfaceFile()"
          >
            打开
          </a-button>
        </div>
      </div>
      <div class="flex-1 h-full">
        <div class="h-[53px] w-full bg-black-50 border border-black-border">
          <input
            class="h-[37px] w-[323px] bg-black-50 border-[#ADADAD] border rounded mt-[8px] ml-[15px] pl-[5px]"
            placeholder="搜索"
          />
          <button @click="jumpToEditor">表盘列表</button>
        </div>
        <div class="h-[calc(100vh-101px)] overflow-y-auto">
          <Watchfaces
            :initialType="activeMenu"
            @updateWatchface="updateWatchface"
          />
        </div>
      </div>
    </div>
    <watchface-create-modal ref="createModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWatchfaceManage } from '@/hooks';

const { pickAndOpenWatchfaceFile } = useWatchfaceManage();
const activeMenu = ref(0);
const createModalRef = ref();
const editWatchfacePath = ref<string>();
const create = () => {
  createModalRef.value?.open?.({
    mode: 'create'
  });
};
const updateWatchface = (path: string) => {
  editWatchfacePath.value = path;
  createModalRef.value?.open?.({
    mode: 'edit',
    path
  });
};
const jumpToEditor = () => {};
</script>

<style scoped></style>
