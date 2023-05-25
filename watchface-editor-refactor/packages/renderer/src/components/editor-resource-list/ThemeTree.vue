<template>
  <div
    class="flex flex-col min-h-[80px]"
    :style="{
      maxHeight: 38 + 36 * themeTree.length + 'px'
    }"
  >
    <ThemeTreeSelect />
    <div class="px-[1px] flex-1 h-full overflow-auto">
      <a-tree
        v-model:expandedKeys="expandedKeys"
        :tree-data="themeTree"
        block-node
        class="tree"
        :selectable="false"
        @drop="onDrop"
        @dragstart="onDragstart"
        @dragend="onDragend"
      >
        <template #title="data">
          <drop-down
            :menus="getRightMenus(data as ThemeTreeNode)"
            trigger="contextmenu"
          >
            <div
              class="px-3 flex items-center justify-between"
              :class="{
              'bg-[#3E3E3E]':[hoverd, selectStore.themeId].includes((data as ThemeTreeNode).key) ,
              '_invalid': invalidTreeIds.includes((data as ThemeTreeNode).key),
            }"
              tabindex="-1"
              @mousemove.stop="() => (hoverd = (data as ThemeTreeNode).key)"
              @mouseleave.stop="() => (hoverd = '')"
              @click.stop="()=>onClick(data as ThemeTreeNode)"
              data-theme-node="true"
            >
              <div class="w-6">
                <icon
                  v-if="(data as ThemeTreeNode).extra.themeStyle.id == selectStore.$state.themeId"
                  icon="Check.svg"
                  :width="15"
                  :height="15"
                  fill="none"
                />
              </div>
              <tree-title
                class="flex-[10] mr-2 h-9"
                :tree-id="(data as ThemeTreeNode).key"
                :title="(data as ThemeTreeNode).extra.themeStyle.name"
                :submit="rename"
                :valid="validName"
                :editKey="editKeyMap[(data as ThemeTreeNode).key]"
                @valid="onValid"
              />
              <a-tooltip
                v-if="
                  (data as ThemeTreeNode).extra.themeStyle.type == 'normal' &&
                  themeTree.length < maxCount
                "
                title="复制"
              >
                <icon
                  class="cursor-pointer"
                  :icon="'add.svg'"
                  :width="14"
                  @click.stop="() => addNormalTheme((data as ThemeTreeNode).extra.themeStyle)"
                />
              </a-tooltip>
            </div>
          </drop-down>
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalShortcuts, useThemeManage } from '@/hooks';
import { useLayerStore } from '@/store/use-layer-store';
import { useSelectStore } from '@/store/use-select-store';
import { AntTreeNodeDropEvent } from 'ant-design-vue/lib/tree';
import { computed, reactive, ref, watch } from 'vue';

const selectStore = useSelectStore();
export interface ThemeTreeNode {
  key: string;
  extra: {
    themeStyle: StoreThemeItem;
  };
  children: false;
}
const expandedKeys = ref<string[]>([]);
const hoverd = ref('');
const {
  addNormalTheme,
  rename,
  validName,
  deleteNormalTheme,
  moveTheme,
  maxCount
} = useThemeManage();
const layerStore = useLayerStore();

// 验证重命名
const invalidTreeIds = ref<string[]>([]);
const onValid = (treeId: string, valid: boolean) => {
  const index = invalidTreeIds.value.findIndex((item) => item == treeId);
  if (valid) {
    // delete
    if (index > -1) invalidTreeIds.value.splice(index, 1);
  } else {
    // add
    if (index < 0) invalidTreeIds.value.push(treeId);
  }
};
const editKeyMap = reactive<Record<string, number>>({});
const themeTree = computed(() => {
  const res: ThemeTreeNode[] = [];
  const themes = layerStore.themes.filter(
    (item) => item.type == selectStore.theme?.type
  );

  themes.forEach((item, index) => {
    res.push({
      key: item.id,
      extra: { themeStyle: item },
      children: false
    });
  });
  return res;
});

const getRightMenus = (data: ThemeTreeNode) => {
  if (data.extra.themeStyle.type == 'AOD') return [];
  const themeStyle = data.extra.themeStyle;
  const res: DropDownMenuItem[] = [
    {
      title: '复制',
      shortcuts: ['CommandOrControl', 'C'],
      onClick() {
        addNormalTheme(themeStyle);
      }
    },
    {
      title: '重命名',
      shortcuts: ['CommandOrControl', 'R'],
      onClick() {
        editKeyMap[themeStyle.id] = Math.random();
      }
    },
    {
      title: '删除',
      disabled: themeTree.value.length <= 1,
      onClick() {
        deleteNormalTheme(themeStyle.id);
      }
    }
  ];
  return res;
};

useGlobalShortcuts(
  [
    {
      keyboardKeys: ['CommandOrControl', 'R'],
      handler: () => {
        console.log('重命名');
        if (selectStore.theme) editKeyMap[selectStore.theme.id] = Math.random();
      }
    },
    {
      keyboardKeys: ['CommandOrControl', 'C'],
      handler: () => {
        if (selectStore.theme) addNormalTheme(selectStore.theme);
      }
    }
  ],
  (e: KeyboardEvent) => {
    const targert = e.target as HTMLDivElement;
    return selectStore.theme?.type == 'normal' && !!targert.dataset?.themeNode;
  }
);

// 点击node时
const onClick = (node: ThemeTreeNode) => {
  selectStore.selectTheme(node.extra.themeStyle.id);
};
const onDrop = (info: AntTreeNodeDropEvent) => {
  console.log('');
  const dropPos = info.node?.pos?.split('-') ?? [];
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  // 放置到哪个元素的后面
  const dropKey = info.node.key + '';
  // 拖拽的元素key
  const dragKey = info.dragNode.key + '';
  dropPosition == -1 ? moveTheme(dragKey) : moveTheme(dragKey, dropKey);
};
const onDragstart = () => {
  // console.log('onDragstart');
};
const onDragend = () => {
  // console.log('onDragend');
};
</script>

<style scoped lang="less">
::v-deep(.tree) {
  .ant-tree-switcher {
    display: none;
  }
  .ant-tree-treenode {
    padding: 0;
    background: #2e2e2e;
    &:has(._invalid) {
      margin-bottom: 18px;
    }
    .ant-tree-node-content-wrapper {
      cursor: default !important;
    }
  }
  .ant-tree-node-content-wrapper {
    padding: 0;
  }
}
</style>
