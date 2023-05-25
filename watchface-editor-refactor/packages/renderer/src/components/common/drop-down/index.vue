<template>
  <a-dropdown :trigger="[trigger]" overlayClassName="base-drop-down">
    <div class="h-full" :class="{ 'cursor-not-allowed': disabled }">
      <slot />
    </div>

    <template v-if="menus?.length && disabled !== true" #overlay>
      <a-menu
        force-sub-menu-render
        class="bg-black max-h-[500px] overflow-auto"
        theme="dark"
      >
        <template v-for="menu in menus" :key="menu.title">
          <template v-if="!menu.hidden">
            <!-- 显示分隔符 -->
            <div v-if="menu.delimiter" class="px-4 my-2">
              <small
                v-if="typeof menu.delimiter == 'string'"
                class="text-white opacity-50"
                >{{ menu.delimiter }}</small
              >
              <div v-else class="border-t border-black-50" />
            </div>

            <!-- 非分隔符 -->
            <MenuItem v-else :menu-item="menu" />
          </template>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import MenuItem from './MenuItem.vue';

defineProps({
  trigger: {
    type: String as PropType<'contextmenu' | 'hover' | 'click'>,
    default: 'hover'
  },
  menus: {
    type: Array as PropType<DropDownMenuItem[]>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>
