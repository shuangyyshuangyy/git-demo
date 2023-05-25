<template>
  <DropDown :trigger="'contextmenu'" :menus="contextmenus()">
    <!-- 统一处理右键/点击/拖拽事件  -->
    <LayersOperator
      @click="handleClicked"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
      @contextmenu="handleContextmenu"
      @longstay="handleLongstay"
      :available-levels="availableLevels"
    >
      <Layer
        v-for="node in uncollapsedFlatShapeTree"
        :class="[
          isDragging &&
          (passiveHighlights.has(node.key) ||
            selectStore.selectedIds.includes(node.key))
            ? 'opacity-50'
            : ''
        ]"
        ref="layerRefs"
        :key="node.key"
        :palette="
          isIn(node, RED_TYPES) || RED_TYPES.has(node.extra.tag)
            ? 'red'
            : 'blue'
        "
        :text="node.extra.name"
        :icon-src="ICON_SRC[node.extra.tag] ?? ''"
        :is-group="!!(node.children || RED_TYPES.has(node.extra.tag))"
        :is-collapse="node.extra.collapsed"
        :level="node.extra.level"
        :visibility-hidden="
          node.extra.visibility && node.ancestryInfo?.hasInvisible
        "
        :visibility="node.extra.visibility"
        :locked-hidden="!node.extra.locked && node.ancestryInfo?.haslocked"
        :locked="node.extra.locked"
        :status="
          selectStore.selectedIds.includes(node.key)
            ? 'highlight'
            : passiveHighlights.has(node.key)
            ? 'passiveHighlight'
            : 'default'
        "
        :disable-hover-style="isDragging"
        @locked-change="changeAttr(node.key, '_isLocked', $event)"
        @visibility-change="changeAttr(node.key, '_visibility', $event)"
        @collapse-change="changeAttr(node.key, '_collapsed', $event)"
        @text-change="
          (newText: string | number | boolean) => {
            if (newText) {
              changeAttr(node.key, 'name', newText);
            }
          }
        "
      />

      <!-- 幽灵图榜样 防止被 overflow-hidden -->
      <Teleport to="#app">
        <div
          class="absolute top-[-1000px] left-[-1000px] font-medium"
          ref="goastRef"
        >
          <Layer
            v-for="node in selectedNodes"
            :key="'drag_' + node.key"
            :palette="
              isIn(node, RED_TYPES) || RED_TYPES.has(node.extra.tag)
                ? 'red'
                : 'blue'
            "
            :text="node.extra.name"
            :icon-src="ICON_SRC[node.extra.tag] ?? ''"
            :is-group="!!node.children"
            :is-collapse="node.extra.collapsed"
            :level="node.extra.level"
            status="passiveHighlight"
          />
        </div>
      </Teleport>
    </LayersOperator>
  </DropDown>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue';
import { useSelectStore } from '@/store/use-select-store';
import { Shape, ShapeType } from '@/services/shape';
import { useGlobalShortcuts } from '@/hooks/use-global-shortcuts';
import { useShapeManage } from '@/hooks/use-shape-manage';
import { ShapeTreeNode, useShapeTree } from '@/hooks/use-shape-tree';
import { isMac } from '@/utils/platform';
import LayerVue from './Layer.vue';

const isDarwin = isMac();
const LAYER_HEIGHT = 48;
const ICON_SRC: Record<string, string> = {
  [ShapeType.Text]: 'shape-text.svg',
  [ShapeType.Image]: 'shape-image.svg',
  [ShapeType.ImageArray]: 'shape-images.svg',
  [ShapeType.ProgressBar]: 'shape-progress.svg',
  [ShapeType.Widget]: 'Widget.svg',
  [ShapeType.Slot]: 'Slot.svg'
};
const RED_TYPES = new Set<ShapeType>([ShapeType.Slot, ShapeType.Widget]);
const passiveHighlights = reactive(new Set<string>());

const layerRefs = ref<Array<InstanceType<typeof LayerVue>>>();
const goastRef = ref<HTMLDivElement>();
const availableLevels = ref<Set<number>[]>();
const isDragging = ref(false);

const selectStore = useSelectStore();
const {
  shapeTree,
  flatShapeTree,
  uncollapsedFlatShapeTree,
  getSortedIds,
  getNodeById,
  isIn,
  getAvailableMoveLevels,
  getIndex,
  getLastOffspringIndex,
  getParent
} = useShapeTree();
const { sloted, unSloted, widgeted, unWidgeted, moveShape } = useShapeManage();

watchEffect(() => {
  passiveHighlight(selectStore.selectedIds);
});

const selectedNodes = computed<ShapeTreeNode[]>(() =>
  getSortedIds(selectStore.selectedIds).map(
    (id) => getNodeById(id) as ShapeTreeNode
  )
);

function handleClicked(positionInfo: LayerOperationInfo, e: MouseEvent) {
  // shift连续新增，control/command单个增加/减少
  selectLayer(
    uncollapsedFlatShapeTree.value[positionInfo.index].key,
    e.shiftKey
      ? 'continuous'
      : (isDarwin ? e.metaKey : e.ctrlKey)
      ? 'toggle'
      : 'replace'
  );
}

function handleContextmenu(positionInfo: LayerOperationInfo) {
  updateSelection(uncollapsedFlatShapeTree.value[positionInfo.index].key);
}

useGlobalShortcuts(
  [
    {
      keyboardKeys: [']'],
      handler: bringToFront
    },
    {
      keyboardKeys: ['['],
      handler: sendToBack
    },
    {
      keyboardKeys: ['CommandOrControl', 'R'],
      handler: rename
    },
    {
      keyboardKeys: ['Shift', 'CommandOrControl', 'H'],
      handler: showHide
    },
    {
      keyboardKeys: ['Shift', 'CommandOrControl', 'L'],
      handler: lockUnlock
    },
    {
      keyboardKeys: ['Backspace'],
      handler: () => {
        selectStore.selectedIds.forEach((id) => {
          Shape.getShape(id)?.destroy();
        });
      }
    }
  ],
  (e: KeyboardEvent) =>
    Boolean(
      selectStore.selectedIds.length &&
        (e.target as HTMLDivElement)?.dataset?.layersNode &&
        selectStore.selectedIds.every((id) => getNodeById(id)) &&
        layerRefs.value?.every((layer) => !layer.duringInput())
    )
);

const contextmenus = () => {
  if (
    !selectStore.selectedIds.length ||
    selectStore.selectedIds.some((id) => !getNodeById(id))
  )
    return;

  const res: DropDownMenuItem[] = [
    {
      title: '移到最前',
      shortcuts: [']'],
      onClick: bringToFront
    },
    {
      title: '移到最后',
      shortcuts: ['['],
      onClick: sendToBack
    },
    { delimiter: true }
  ];

  const firstNode = getNodeById(selectStore.selectedIds[0]) as ShapeTreeNode;

  // 创建为表达式：选中项为同一层级，均非表达式/容器 且 不在表达式/容器里
  const isSameLevel = selectedNodes.value.every((node) => {
    return node.extra.level === firstNode.extra.level;
  });
  const allNotRed = selectedNodes.value.every(
    (node) => !RED_TYPES.has(node.extra.tag)
  );
  const notInRed = !isIn(firstNode, RED_TYPES); // 同一层级的话只看一个就代表其他了

  if (isSameLevel && allNotRed && notInRed) {
    res.push({
      title: '创建为表达式',
      onClick() {
        widgeted(selectStore.selectedIds, selectStore.themeId);
      }
    });
  }

  // 解除表达式：选中项里有不在容器里的表达式
  const widgets = selectedNodes.value.filter(
    (node) =>
      node.extra.tag === ShapeType.Widget &&
      !isIn(node, new Set([ShapeType.Slot]))
  );

  if (widgets.length) {
    res.push({
      title: '解除表达式',
      onClick() {
        widgets.forEach((node) => unWidgeted(node.key, selectStore.themeId));
        selectStore.unselect();
      }
    });
  }

  // 创建容器：选中项为同一层级，均为表达式，且不在容器里
  const allWidget = selectedNodes.value.every(
    (node) => node.extra.tag === ShapeType.Widget
  );
  const notInSlot = !isIn(firstNode, new Set([ShapeType.Slot])); // 同一层级的话只看一个就代表其他了

  if (isSameLevel && allWidget && notInSlot) {
    res.push({
      title: '创建容器',
      onClick() {
        sloted(selectStore.selectedIds, selectStore.themeId);
      }
    });
  }

  // 解除容器：选中项里有容器
  const slots = selectedNodes.value.filter(
    (node) => node.extra.tag === ShapeType.Slot
  );
  if (slots.length) {
    res.push({
      title: '解除容器',
      onClick() {
        slots.forEach((node) => unSloted(node.key, selectStore.themeId));
        selectStore.unselect();
      }
    });
  }

  // 重命名
  if (selectStore.selectedIds.length === 1) {
    res.push({
      title: '重命名',
      shortcuts: ['CommandOrControl', 'R'],
      onClick: rename
    });
  }

  res.push(
    ...([
      { delimiter: true },
      {
        title: '隐藏/显示',
        shortcuts: ['Shift', 'CommandOrControl', 'H'],
        onClick: showHide
      },
      {
        title: '锁定/解锁',
        shortcuts: ['Shift', 'CommandOrControl', 'L'],
        onClick: lockUnlock
      }
    ] as DropDownMenuItem[])
  );

  return res;
};

function handleDragstart(positionInfo: LayerOperationInfo, e: DragEvent) {
  const target = uncollapsedFlatShapeTree.value[positionInfo.index];
  // updateSelection(target.key); ***待改 本期先不支持多选拖拽
  selectLayer(target.key);
  isDragging.value = true;
  availableLevels.value = getAvailableMoveLevels(target);

  if (goastRef.value) {
    goastRef.value.style.width = `${
      (layerRefs.value && layerRefs.value[0].$el.offsetWidth) || 320
    }px`;
    // 原生幽灵图片不适用于多选，且设计稿上无右侧图标
    e.dataTransfer?.setDragImage(
      goastRef.value,
      positionInfo.offsetX,
      selectedNodes.value.findIndex((node) => node.key === target.key) *
        LAYER_HEIGHT +
        positionInfo.offsetY
    );
  }
}

function handleDragend(index: number, level: number) {
  // ***待改 目前selectedlayer一定只有一个
  let parentIndex = index - 1;
  let brotherNum = 0;

  while (
    parentIndex >= 0 &&
    uncollapsedFlatShapeTree.value[parentIndex].extra.level >= level
  ) {
    if (
      uncollapsedFlatShapeTree.value[parentIndex].extra.level === level &&
      uncollapsedFlatShapeTree.value[parentIndex].key !==
        selectedNodes.value[0].key
    ) {
      brotherNum++;
    }
    parentIndex--;
  }

  if (parentIndex < 0) {
    moveShape(
      selectedNodes.value[0].key,
      selectStore.themeId,
      undefined,
      brotherNum
    );
  } else {
    moveShape(
      selectedNodes.value[0].key,
      selectStore.themeId,
      uncollapsedFlatShapeTree.value[parentIndex].key,
      brotherNum
    );
  }

  isDragging.value = false;
}

function handleLongstay(index: number) {
  const target = uncollapsedFlatShapeTree.value[index - 1];

  // 因为本期表达式不许移入移出，目前只有容器支持表达式停留时展开
  if (
    selectedNodes.value[0].extra.tag === ShapeType.Widget &&
    target &&
    target.extra.tag === ShapeType.Slot &&
    target.extra.collapsed
  ) {
    changeAttr(target.key, '_collapsed', false);

    setTimeout(() => {
      // 更新一下可被拖动到的位置
      availableLevels.value = getAvailableMoveLevels(selectedNodes.value[0]);
    }, 20);
  }
}

function selectLayer(
  id: string,
  mode: 'replace' | 'toggle' | 'continuous' = 'replace'
) {
  switch (mode) {
    case 'replace':
      selectStore.select([id]);
      break;
    case 'toggle':
      if (selectStore.selectedIds.includes(id)) {
        selectStore.select(
          selectStore.selectedIds.filter((selectId) => selectId !== id)
        );
      } else {
        selectStore.select([...selectStore.selectedIds, id]);
      }
      break;
    case 'continuous':
      if (!selectStore.selectedIds.length) {
        selectStore.select([id]);
      } else {
        const currentIndex = getIndex(
          getNodeById(id) as ShapeTreeNode,
          'flatShapeTree'
        );
        const indices = selectedNodes.value.map((node) =>
          getIndex(node, 'flatShapeTree')
        );
        continuousSelect(
          Math.min(...indices, currentIndex),
          Math.max(...indices, currentIndex)
        );
      }

      break;
    default:
      break;
  }
}

// 连选
function continuousSelect(minIndex: number, maxIndex: number) {
  // 第一个一定包括
  const selections = [flatShapeTree.value[minIndex].key];
  // 第一个的子孙范围超过了选中范围
  const lastOffspringIndex = getLastOffspringIndex(minIndex);
  if (lastOffspringIndex >= maxIndex) {
    selectStore.select(selections);
    return;
  }

  let index = lastOffspringIndex + 1;

  // 选中的范围内如果子孙范围不超的话就选中
  while (index <= maxIndex) {
    const lastOffspringIndex = getLastOffspringIndex(index);
    if (lastOffspringIndex <= maxIndex || index === maxIndex) {
      selections.push(flatShapeTree.value[index].key);
      index = lastOffspringIndex + 1;
    } else {
      index++;
    }
  }

  selectStore.select(selections);
}

function passiveHighlight(parentIds: string[]) {
  // 被动选中子辈
  passiveHighlights.clear();
  for (const parentId of parentIds) {
    const node = getNodeById(parentId);
    if (!node) continue;
    const parentLevel = node.extra.level;
    let index = getIndex(node, 'flatShapeTree') + 1;

    while (
      flatShapeTree.value[index] &&
      flatShapeTree.value[index].extra.level > parentLevel
    ) {
      passiveHighlights.add(flatShapeTree.value[index].key);
      index++;
    }
  }
}

function changeAttr(
  id: string,
  attrKey: keyof Shape['attrs'],
  value: string | number | boolean
) {
  Shape.getShape(id)?.setAttrs({ [attrKey]: value });
}

function updateSelection(id: string) {
  // 当前操作位置对应的图层没有包含在选中范围里
  if (!selectStore.selectedIds.includes(id)) {
    selectLayer(id);
  }
}

function bringToFront() {
  // 每个图层移到相邻同层级中的最前；多选时同层级相对顺序同移动前的相对顺序，非同层级各自处理
  for (let i = selectedNodes.value.length - 1; i >= 0; i--) {
    const node = selectedNodes.value[i];
    const parentNode = getParent(node);
    moveShape(node.key, selectStore.themeId, parentNode?.key);
  }
}

function sendToBack() {
  selectedNodes.value.forEach((node) => {
    const parentNode = getParent(node);
    moveShape(
      node.key,
      selectStore.themeId,
      parentNode?.key,
      parentNode ? parentNode.children!.length - 1 : shapeTree.value.length - 1
    );
  });
}

function rename() {
  // ref 数组并不保证与源数组相同的顺序
  const layer = layerRefs.value?.find(
    (v) => v.$.vnode.key === selectStore.selectedIds[0]
  );
  if (layer) {
    layer.edit();
  }
}

function showHide() {
  // 都是可见的话隐藏，有一个隐藏着的就全可见
  const isVisible = selectedNodes.value.some(
    (layer) => !layer.extra.visibility
  );
  selectStore.selectedIds.forEach((id) =>
    Shape.getShape(id)?.setAttrs({ _visibility: isVisible })
  );
}

function lockUnlock() {
  // 都是锁定的话解锁，有一个开着的就全锁上
  const isLock = selectedNodes.value.some((layer) => !layer.extra.locked);
  selectStore.selectedIds.forEach((id) =>
    Shape.getShape(id)?.setAttrs({ _isLocked: isLock })
  );
}
</script>
