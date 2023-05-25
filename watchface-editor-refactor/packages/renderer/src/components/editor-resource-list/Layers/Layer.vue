<template>
  <div
    draggable="true"
    class="h-12 cursor-default border-[1px] border-transparent"
    :class="[
      status !== 'highlight' && !disableHoverStyle
        ? PALETTES[palette].hoverClass
        : ''
    ]"
    :style="{
      backgroundColor:
        status === 'default' ? 'transparent' : PALETTES[palette][status]
    }"
  >
    <div
      class="flex items-center h-full w-full layer"
      :style="{
        paddingLeft: `${11 + level * 24}px`,
        opacity: visibility && !visibilityHidden ? 1 : 0.3
      }"
    >
      <div
        class="w-4 h-4 mr-[5px] flex justify-center items-center shrink-0"
        :class="[isGroup ? 'visible' : 'invisible']"
        @click.stop="collapseChange"
      >
        <Icon
          v-show="!isCollapse"
          icon="PolygonBottom.svg"
          :width="7"
          :height="3"
          :fill="PALETTES[palette].icon"
          stroke="none"
        />
        <Icon
          v-show="isCollapse"
          icon="PolygonRight.svg"
          :width="3"
          :height="6"
          :fill="PALETTES[palette].icon"
          stroke="none"
        />
      </div>
      <div class="w-3 h-3 mr-[5px] flex justify-center items-center shrink-0">
        <Icon
          :icon="iconSrc"
          :width="9"
          :height="9"
          fill="none"
          :stroke="PALETTES[palette].icon"
        />
      </div>

      <LayerText
        ref="textRef"
        @submit="textChange"
        :text="text"
        :palette="palette"
        :style="{
          color: PALETTES[palette].text
        }"
      />

      <div
        class="right-btn w-4 h-4 flex justify-center items-center ml-auto mr-[2px] shrink-0"
        :class="lockedHidden || locked ? 'visible' : 'invisible'"
        @click.stop="lockedChange"
      >
        <div
          v-if="lockedHidden"
          class="w-1 h-1 rounded"
          :style="{
            background: PALETTES[palette].text
          }"
        ></div>
        <Icon
          v-else
          class="svg-transition-none"
          :icon="`${locked ? 'lock' : 'unlock'}.svg`"
          :width="9"
          :height="9"
          :fill="PALETTES[palette].text"
          stroke="none"
        />
      </div>

      <div
        class="right-btn w-4 h-4 flex justify-center items-center mr-3 shrink-0"
        :class="visibilityHidden || !visibility ? 'visible' : 'invisible'"
        @click.stop="visibilityChange"
      >
        <div
          v-if="visibilityHidden"
          class="w-1 h-1 rounded"
          :style="{
            background: PALETTES[palette].text
          }"
        ></div>
        <Icon
          v-else
          class="svg-transition-none mt-[2px]"
          :icon="`${visibility ? 'eye-open' : 'eye-close'}.svg`"
          :width="9"
          :height="9"
          fill="none"
          :stroke="PALETTES[palette].text"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LayerText from './LayerText.vue';

const PALETTES = {
  red: {
    text: '#FF5E20',
    icon: '#FF5E20',
    hoverClass: 'hover:border-[#FF5E20]',
    highlight: '#58382b',
    passiveHighlight: '#43332d'
  },
  blue: {
    text: 'white',
    icon: '#9B9B9B',
    hoverClass: 'hover:border-[#2094FF]',
    highlight: '#384B67',
    passiveHighlight: '#2D3843'
  }
};

const props = withDefaults(
  defineProps<{
    palette?: 'red' | 'blue';
    text?: string;
    iconSrc: string;
    isGroup?: boolean;
    isCollapse?: boolean;
    level?: number;
    visibilityHidden?: boolean;
    visibility?: boolean;
    lockedHidden?: boolean;
    locked?: boolean;
    status?: 'default' | 'highlight' | 'passiveHighlight';
    disableHoverStyle?: boolean;
  }>(),
  {
    palette: 'blue',
    text: '图层名',
    isGroup: false,
    isCollapse: false,
    level: 0,
    visibilityHidden: false,
    visibility: true,
    lockedHidden: false,
    locked: false,
    status: 'default',
    disableHoverStyle: false
  }
);

const emit = defineEmits<{
  (event: 'lockedChange', value: boolean): void;
  (event: 'visibilityChange', value: boolean): void;
  (event: 'collapseChange', value: boolean): void;
  (event: 'textChange', value: string): void;
}>();

const textRef = ref<InstanceType<typeof LayerText>>();

function lockedChange() {
  emit('lockedChange', !props.locked);
}

function visibilityChange() {
  emit('visibilityChange', !props.visibility);
}

function collapseChange() {
  emit('collapseChange', !props.isCollapse);
}

function textChange(newText: string) {
  emit('textChange', newText);
}

function edit() {
  textRef.value?.edit();
}

function duringInput() {
  return textRef.value?.showInput;
}

defineExpose({
  edit,
  duringInput
});
</script>

<style scoped lang="postcss">
.svg-transition-none,
.svg-transition-none :deep(path) {
  @apply transition-none;
}

.layer:hover > .right-btn {
  @apply visible;
}
</style>
