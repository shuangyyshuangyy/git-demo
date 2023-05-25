<template>
  <a-collapse v-model:activeKey="activeKey" ghost>
    <a-collapse-panel key="1" header="排版">
      <div class="px-[10px] text-xs">
        <div>
          <div
            class="my-1"
            :style="{ opacity: !curShape.attrs.source ? '1' : '0.4' }"
          >
            文本
          </div>
          <a-input
            class="w-full h-[30px] bg-black-50"
            :style="{
              opacity: !curShape.attrs.source ? '1' : '0.4',
              border: '1px solid #565656 !important'
            }"
            v-model="textAttrs.string"
            @change="setAttrsAttribute('string', textAttrs.string)"
            :disabled="!!curShape.attrs.source"
          />
        </div>

        <FontCollection
          @set-attribute="setAttrsAttribute"
          :font-id="textAttrs.fontId"
          :font-size="textAttrs.fontSize"
          :font-weight="textAttrs.fontWeight"
        />
        <div class="flex">
          <div class="w-1/2 mr-[19px]">
            <FontSpace
              @set-attribute="setAttrsAttribute"
              :letter-space="textAttrs.letterSpace"
            />
          </div>
          <div class="w-1/2">
            <TextAlign
              :text-align="textAttrs.align"
              @set-attribute="setAttrsAttribute"
            />
          </div>
        </div>
        <div class="w-1/2 pr-[9px]">
          <TextColor
            :color="textAttrs.color"
            @set-attribute="setAttrsAttribute"
          />
        </div>
        <TextDeriction
          :style="textAttrs.style"
          :radius="textAttrs.radius"
          :start-angle="textAttrs.startAngle"
          @set-attribute="setAttrsAttribute"
        />
      </div>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="效果">
      <template #extra>
        <div @click.stop="">
          <AttrAddSubtrackIcon :status="showSource" @change="onShowToggle" />
        </div>
      </template>

      <data-source2
        :source="props.curShape.attrs.source"
        @change="setDataSource"
        attr="文本"
      />
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from 'vue';
import { Shape } from '@/services/shape';
import { TextAttribute } from '@/services/shape/attributes/text';

const props = defineProps({
  curShape: {
    type: Object as PropType<Shape>,
    default: ''
  }
});
const activeKey = ref(['1']);

const attrs = props.curShape.attrs as TextAttribute;
const textAttrs = reactive({
  fontId: attrs.fontId ?? 'MiSansW',
  fontSize: attrs.fontSize ?? '17',
  fontWeight: attrs.fontWeight ?? 'Regular',
  letterSpace: attrs.letterSpace ?? '0',
  string: attrs.string ?? '',
  style: attrs.style ?? 'normal',
  align: attrs.align ?? 'left',
  color: attrs.color ?? '#ffffff',
  radius: attrs.radius ?? '0',
  startAngle: attrs.startAngle ?? '0',
  dataSource: attrs.source ?? ''
});

const setAttrsAttribute = (
  attrName: keyof TextAttribute,
  attrInput: string | number
) => {
  props.curShape?.setAttrs({ [attrName]: attrInput as string });
};

watch(
  () => props.curShape,
  () => {
    let text = props.curShape.attrs as TextAttribute;
    textAttrs.fontSize = text.fontSize;
    textAttrs.fontWeight = text.fontWeight;
    textAttrs.fontId = text.fontId;
    textAttrs.letterSpace = text.letterSpace;
    textAttrs.string = text.string;
    textAttrs.align = text.align;
    textAttrs.color = text.color;
    textAttrs.style = text.style;
    textAttrs.dataSource = text.source ?? '';
  },
  {
    immediate: true
  }
);

const setDataSource = ({ source }: { source: string }) => {
  setAttrsAttribute('source', source);
};
const removeDataSource = () => {
  setAttrsAttribute('source', '');
  activeKey.value = activeKey.value.filter((item) => item !== '2');
};

const showSource = ref(!!props.curShape.attrs.source);
const onShowToggle = (status: boolean) => {
  showSource.value = status;
  if (status) {
    if (!activeKey.value.includes('2')) activeKey.value.push('2');
  } else {
    removeDataSource();
  }
};
</script>
