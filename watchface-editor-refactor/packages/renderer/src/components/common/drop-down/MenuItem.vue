<template>
  <!-- 如果有子元素 -->
  <template v-if="menuItem.children?.length && !disabled">
    <a-sub-menu :key="menuItem.title" class="w-[280px] bg-black !m-0">
      <template #title>
        <MenuTitle :menu-item="menuItem" :disabled="disabled" />
      </template>
      <template v-for="menu in menuItem.children" :key="menu.title">
        <menu-item v-if="!menu.hidden" :menu-item="menu" />
      </template>
    </a-sub-menu>
  </template>

  <!-- 没有子元素 -->
  <template v-else>
    <a-menu-item
      class="!p-0 !m-0"
      @click="
        () => {
          if (disabled) return;
          menuItem.onClick?.();
        }
      "
    >
      <menu-title :menu-item="menuItem" :disabled="disabled" />
    </a-menu-item>
  </template>
</template>
<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import MenuTitle from './MenuTitle.vue';

export default defineComponent({
  components: { MenuTitle },
  props: {
    menuItem: {
      type: Object as PropType<DropDownMenuItem>,
      default: () => ({})
    }
  },
  setup(props) {
    const disabled = computed(() => {
      if (props.menuItem.disabled == undefined) return false;
      if (typeof props.menuItem.disabled == 'boolean')
        return props.menuItem.disabled;
      return !!props.menuItem.disabled?.(props.menuItem);
    });
    return {
      disabled
    };
  }
});
</script>
