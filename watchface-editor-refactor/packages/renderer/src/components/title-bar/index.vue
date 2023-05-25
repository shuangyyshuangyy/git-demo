<template>
  <div
    class="top-0 w-screen _drag overflow-hidden bg-black-80 flex justify-center"
  >
    <div
      class="text-white _no_drag flex justify-center items-center text-lg font-semibold relative"
    >
      <template v-if="isHome">
        <div class="">表盘工具</div>
      </template>
      <!-- 编辑页面 -->
      <template v-else>
        <div class="cursor-pointer">
          <span @click="openWorkDir"> {{ watchName }}</span>
        </div>
        <div
          v-if="status == 'unsaved'"
          class="absolute w-[55px] left-full top-1/2 -translate-y-1/2 text-sm opacity-70"
        >
          -edited
        </div>
      </template>
    </div>
    <debug v-if="isDev" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElectronApi } from '@/services/electron.api';
import { useWatchfaceStore } from '@/store/use-watchface-store';
import { useRoute } from 'vue-router';
import Debug from './Debug.vue';
import { useWatchfaceStatus } from '@/hooks';

const watchInfo = useWatchfaceStore();
const route = useRoute();
const { status } = useWatchfaceStatus();
const isHome = computed(() => {
  return route.name == 'home';
});

const openWorkDir = () => {
  console.log('open', watchInfo.path);
  ElectronApi.showItemInFolder(watchInfo.path);
};

const isDev = import.meta.env.DEV;

const watchName = computed(() => watchInfo.watchface.name);
</script>

<style scoped>
._drag {
  -webkit-app-region: drag;
}
._no_drag {
  -webkit-app-region: no-drag;
}
</style>
