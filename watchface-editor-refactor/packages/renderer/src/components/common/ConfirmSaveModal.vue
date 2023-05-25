<template>
  <a-modal v-model:visible="visible" title="提示" :width="515">
    <div class="text-center text-lg">
      是否保存对{{ watchfaceStore.$state.Watchface.name ?? '-' }} 的修改？
    </div>

    <template #footer>
      <a-button key="back" @click="() => (visible = false)">取消</a-button>
      <a-button key="back" @click="() => back(false)">否</a-button>
      <a-button
        type="primary"
        :loading="watchfaceSaving"
        @click="() => back(true)"
      >
        是
      </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { useWatchfaceManage } from '@/hooks';
import { useWatchfaceStore } from '@/store/use-watchface-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { saveWatchfaceData, watchfaceSaving } = useWatchfaceManage();
const watchfaceStore = useWatchfaceStore();
const router = useRouter();
const visible = ref(false);
defineExpose({
  open: () => {
    visible.value = true;
  }
});
const back = async (save = true) => {
  if (save) {
    await saveWatchfaceData();
  }
  router.push('home');
};
</script>
