<template>
  <div>
    <div
      class="flex items-center w-full my-1 bg-black text-normal h-9"
      :style="{
        paddingLeft: level * 24 + 'px'
      }"
      :class="{
        selected: layer.value == selected,
        ['hover:bg-blue']: selectable,
        ['cursor-not-allowed']: !selectable && !isSelected
      }"
      @click="
        () => {
          if (selectable) onSelect?.(layer);
        }
      "
      @mouseenter.stop="() => enter(layer)"
      @mouseleave="() => leave(layer)"
    >
      <div class="flex items-center px-0">
        <div class="w-6">
          <!-- switcher -->
          <div
            v-if="isGroup"
            class="flex items-center justify-center"
            @click.stop="onClickSwithcer"
          >
            <icon
              class=""
              :icon="'arrow-down.svg'"
              :style="{
                transform: expanded ? '' : 'rotate(-90deg)'
              }"
              :width="13"
              :height="8"
            />
          </div>
        </div>

        <!-- 显示title -->
        <div
          class="pr-1 mr-0"
          :class="{
            ['opacity-60']: !selectable && !isSelected
          }"
        >
          <template v-if="!slots.title">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis w-full">
              {{ layer.label }}
            </div>
          </template>
          <template v-else>
            <slot v-bind="layer" name="title" />
          </template>
        </div>
      </div>
    </div>
  </div>
  <template v-if="isGroup && layer.children?.length && expanded">
    <base-select-item
      v-for="item1 in layer.children"
      :key="item1.value"
      :layer="item1"
      :level="level + 1"
      :on-select="onSelect"
      :selected="selected"
      :enter="enter"
      :leave="leave"
    >
      <!-- <template v-if="slots.title" #title="_layer">
        <slot name="title" v-bind="(_layer as BaseSelectItem)" />
      </template> -->
    </base-select-item>
  </template>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, useSlots } from 'vue';
const props = defineProps({
  layer: {
    type: Object as PropType<BaseSelectItem>,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  onSelect: {
    type: Function as PropType<(value: BaseSelectItem) => void>,
    default: () => ({})
  },
  enter: {
    type: Function as PropType<(value: BaseSelectItem) => void>,
    default: () => ({})
  },
  leave: {
    type: Function as PropType<(value: BaseSelectItem) => void>,
    default: () => ({})
  },
  selected: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  }
});

const slots = useSlots();
const isGroup = computed(() => props.layer.children?.length);

const selectable = computed(() => {
  const selectable = props.layer.selectable;
  if (selectable == undefined) return true;
  if (typeof selectable == 'boolean') return selectable;
  return selectable?.(props.layer);
});

const isSelected = computed(() => props.layer.value == props.selected);

const expanded = ref(true);
const onClickSwithcer = () => {
  expanded.value = !expanded.value;
};
</script>

<style scoped>
.selected {
  background: #2094ff;
}
</style>
