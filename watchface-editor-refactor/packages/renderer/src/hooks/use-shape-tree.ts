import { Shape, ShapeType } from '@/services/shape';
import { useSelectStore } from '@/store/use-select-store';
import { emitter, EventType } from '@/utils/emitter.utils';
import { debounce } from 'lodash-es';
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue';

type AncestryInfo = {
  haslocked: boolean;
  hasInvisible: boolean;
  nodes: ShapeTreeNode[];
};

export interface ShapeTreeNode {
  key: string;
  extra: {
    index: number;
    tag: ShapeType;
    name: string;
    locked: boolean;
    visibility: boolean;
    level: number;
    collapsed: boolean;
  };
  children?: ShapeTreeNode[];
  ancestryInfo?: AncestryInfo;
}

const _shapeTree: Ref<ShapeTreeNode[]> = ref([]);

export function useShapeTree() {
  const generate = debounce(() => {
    const _generate = (
      shapes: Shape[],
      level = 0,
      ancestryInfo: AncestryInfo | undefined = undefined
    ) => {
      const items2: ShapeTreeNode[] = [];
      const len = shapes?.length;
      for (let i = len - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (!shape) continue;

        const item2: ShapeTreeNode = {
          key: shape.id,
          extra: {
            index: i,
            tag: shape.type === 'ThreePointers' ? ShapeType.Widget : shape.type,
            locked: !!shape.attrs._isLocked,
            visibility: !!shape.attrs._visibility,
            name: shape.attrs.name ?? '',
            collapsed: !!shape.attrs._collapsed,
            level
          }
        };

        if (ancestryInfo) {
          item2.ancestryInfo = ancestryInfo;
        }

        if (shape.children?.length) {
          const res = _generate(shape?.children ?? [], level + 1, {
            haslocked: ancestryInfo?.haslocked || item2.extra.locked,
            hasInvisible: ancestryInfo?.hasInvisible || !item2.extra.visibility,
            nodes: [...(ancestryInfo?.nodes ?? []), item2]
          });
          item2.children = res;
        }

        items2.unshift(item2);
      }
      return items2;
    };

    const curthemeId = useSelectStore().themeId;
    const res = _generate(Shape.shapeTree(curthemeId, false));
    _shapeTree.value = res;
    // 每次shape tree改变后，执行一下刷新
  }, 20);

  // 需要重新计算tree的事件
  const eventTypes: EventType[] = [
    EventType['watchface:opened'],
    EventType['watchface:description-loaded'],
    EventType['shape:create'],
    EventType['shape:deleted'],
    EventType['shape:moved'],
    EventType['shape:set-attr'],
    EventType['shape:widgeted'],
    EventType['shape:unwidgeted'],
    EventType['shape:sloted'],
    EventType['shape:unsloted'],
    EventType['theme:selected'],
    EventType['undo-redo']
  ];

  onMounted(() => {
    generate();
    emitter.on(eventTypes, generate);
  });

  onBeforeUnmount(() => {
    emitter.off(eventTypes, generate);
    _shapeTree.value = [];
  });

  const flatShapeTree = computed(() => {
    const shapes = [..._shapeTree.value];
    const result = [];
    let node;

    while ((node = shapes.shift())) {
      result.push(node);
      if (node.children) {
        shapes.unshift(...node.children);
      }
    }
    return result;
  });

  const uncollapsedFlatShapeTree = computed<ShapeTreeNode[]>(() => {
    const shapes = [..._shapeTree.value];
    const result = [];
    let node;

    while ((node = shapes.shift())) {
      result.push(node);
      if (node.children && !node.extra.collapsed) {
        shapes.unshift(...node.children);
      }
    }
    return result;
  });

  const _guide = computed<Map<string, number>>(() => {
    const map = new Map();
    flatShapeTree.value.forEach((node, index) => map.set(node.key, index));
    return map;
  });

  const _uncollapsedGuide = computed<Map<string, number>>(() => {
    const map = new Map();
    uncollapsedFlatShapeTree.value.forEach((node, index) =>
      map.set(node.key, index)
    );
    return map;
  });

  const getNodeById = (id: string): ShapeTreeNode | null => {
    const index = _guide.value.get(id);
    return index !== undefined ? flatShapeTree.value[index] : null;
  };

  const getParent = (node: ShapeTreeNode): ShapeTreeNode | null => {
    if (node.ancestryInfo?.nodes.length) {
      return node.ancestryInfo.nodes[node.ancestryInfo.nodes.length - 1];
    } else {
      return null;
    }
  };

  /**
   * 将节点 id 按 flatShapeTree 中的 index 从小到大排序，返回新数组
   * @param ids 需要被排序的节点 id 们
   */
  const getSortedIds = (ids: string[]): string[] => {
    return ids
      .filter((id) => _guide.value.has(id))
      .sort((a, b) => _guide.value.get(a)! - _guide.value.get(b)!);
  };

  /**
   * 目标是否在某些类型的节点内部
   * @param target 检测目标
   * @param ancestry 被检测的祖先类型集合
   */
  const isIn = (target: ShapeTreeNode, ancestry: Set<ShapeType>): boolean => {
    if (target.ancestryInfo?.nodes.length) {
      for (let i = 0; i < target.ancestryInfo.nodes.length; i++) {
        if (ancestry.has(target.ancestryInfo.nodes[i].extra.tag)) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * 获得目标的 index
   * @param target 被检测 index 的目标
   * @param relativeTo 想知道的 index 是相对于哪种树的
   */
  const getIndex = (
    target: ShapeTreeNode,
    relativeTo: 'flatShapeTree' | 'uncollapsedFlatShapeTree' | 'shapeTree'
  ): number => {
    switch (relativeTo) {
      case 'flatShapeTree':
        return _guide.value.get(target.key) ?? -1;
      case 'uncollapsedFlatShapeTree':
        return _uncollapsedGuide.value.get(target.key) ?? -1;
      default:
        return target.extra.index;
    }
  };

  /**
   * 获得目标相对于 uncollapsedFlatShapeTree 中所有 index 对应的可移动至的层级
   * @param target 被检测可移动至的所有层级的目标
   */
  const getAvailableMoveLevels = (target: ShapeTreeNode): Set<number>[] => {
    const range: [number, number] = [
      0,
      uncollapsedFlatShapeTree.value.length + 1
    ];
    // 本期：父亲是表达式的话限制移动范围为父亲之内
    const parent = getParent(target);
    if (parent && parent.extra.tag === ShapeType.Widget) {
      range[0] = getIndex(parent, 'uncollapsedFlatShapeTree') + 1;
      range[1] = range[0] + parent.children!.length;
    }

    // 普通元素父不为容 表达式父不为表 容器父不为容、表
    const fatherException: Set<ShapeType> = new Set();
    switch (target.extra.tag) {
      case ShapeType.Slot:
        fatherException.add(ShapeType.Slot);
        fatherException.add(ShapeType.Widget);
        break;
      case ShapeType.Widget:
        fatherException.add(ShapeType.Widget);
        break;
      default:
        fatherException.add(ShapeType.Slot);
        break;
    }

    const length = uncollapsedFlatShapeTree.value.length + 1;
    let result: Set<number>[] = new Array(length)
      .fill(undefined)
      .map(() => new Set());

    if (range[0] <= 0) {
      // 第一个图层一定为 0 级，且没有父亲就一定可以drop
      result[0].add(0);
    }

    if (range[1] >= length) {
      // 最后一个位置一定可以作为 level 0 添加
      result[length - 1].add(0);
    }

    for (let i = 1; i < length; i++) {
      if (i < range[0] || i > range[1]) continue;

      // 先看上方
      const last = uncollapsedFlatShapeTree.value[i - 1];

      let topLevel;
      if (
        (last.children ||
          last.extra.tag === ShapeType.Widget ||
          last.extra.tag === ShapeType.Slot) &&
        !last.extra.collapsed
      ) {
        //如果是展开组，则可加到它的下一级
        if (!fatherException.has(last.extra.tag)) {
          result[i].add(last.extra.level + 1);
        }
        topLevel = last.extra.level + 1;
      } else {
        // 其他情况，则可与上层层级统一
        const father = getParent(last);
        if (!father || !fatherException.has(father.extra.tag)) {
          result[i].add(last.extra.level);
        }
        topLevel = last.extra.level;
      }

      // 再看下方
      const next = uncollapsedFlatShapeTree.value[i];
      let bottomLevel;
      if (next) {
        bottomLevel = next.extra.level;

        // 可以和下方元素保持一致
        const father = getParent(next);
        if (!father || !fatherException.has(father.extra.tag)) {
          result[i].add(bottomLevel);
        }
      } else {
        bottomLevel = 0;
      }

      // 也可以在上下之间的数值里任选
      if (topLevel - bottomLevel > 1) {
        for (let j = bottomLevel + 1; j < topLevel; j++) {
          // 上面第一个比它level小的
          let k = i - 1;
          while (uncollapsedFlatShapeTree.value[k].extra.level >= j) {
            k--;
          }
          if (
            !fatherException.has(uncollapsedFlatShapeTree.value[k].extra.tag)
          ) {
            result[i].add(j);
          }
        }
      }
    }

    // 本期：非表达式不能改变层级
    const fixedLevel =
      target.extra.tag === ShapeType.Widget ? -1 : target.extra.level;
    if (fixedLevel >= 0) {
      result.forEach((map) => {
        if (map.has(fixedLevel)) {
          map.clear();
          map.add(fixedLevel);
        } else {
          map.clear();
        }
      });
    }

    return result;
  };

  /**
   * 获得目标相对于 flatShapeTree 的最远子孙范围
   * @param parentIndex 目标在 flatShapeTree 中的 index
   */
  const getLastOffspringIndex = (parentIndex: number): number => {
    const parentLevel = flatShapeTree.value[parentIndex].extra.level;
    let index = parentIndex;
    while (
      flatShapeTree.value[index + 1] &&
      flatShapeTree.value[index + 1].extra.level > parentLevel
    ) {
      index++;
    }
    return index;
  };

  return {
    shapeTree: _shapeTree,
    flatShapeTree,
    uncollapsedFlatShapeTree,
    getParent,
    getNodeById,
    getSortedIds,
    isIn,
    getIndex,
    getAvailableMoveLevels,
    getLastOffspringIndex
  };
}
