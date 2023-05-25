<template>
  <div class="w-screen h-screen overflow-hidden bg-black-10">
    <title-bar class="h-12" />
    <div class="h-[calc(100vh-48px)]">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEmitterListener } from './hooks/use-event-listener';
import { EventType } from './utils/emitter.utils';
import { useWatchfaceHistory } from './hooks/use-watchface-history';
// 打开记录
const { addItem, updateItems } = useWatchfaceHistory();
useEmitterListener(
  EventType['watchface:description-loaded'],
  (path: string) => {
    if (path) addItem({ path, active: true });
  }
);
useEmitterListener(EventType['watchface:description-update'], updateItems);
useEmitterListener(EventType['watchface:preview-update'], updateItems);
</script>

<style scoped></style>
