<template>
  <div
    class="bg-black-50 border-[1px] border-black-border mt-[-1px] h-full flex flex-col"
  >
    <!-- 样式列表 -->
    <ThemeTree class="flex-[1] overflow-hidden" />

    <!-- 图层大框 -->
    <div
      class="relative flex-[3] overflow-y-scroll layer-frame border-t-[2px] border-black-border"
    >
      <!-- 图层小框 -->
      <div class="border-b-[1px] border-black-border text-sm font-medium">
        <Layers />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.layer-frame::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
