<template>
  <div class="px-4 mt-3">
    <div class="mb-3 text-white font-semibold">类型</div>
    <div class="w-2/3 mb-5">
      <BaseSelect
        :value="shape.attrs.type"
        :data="typeList"
        @select="(item:BaseSelectItem)=>setAttrs({'type':item.value as 'line'})"
      />
    </div>
    <!-- 线宽 -->
    <div>
      <span class="text-[#979797]">线宽</span>
      <div class="mt-1 flex items-center">
        <Icon icon="pointerEnd.svg" :width="14" :height="14" />
        <a-input-number
          class="bg-black-50 ml-3 text-base"
          :defaultValue="shape.attrs['barWidth']"
          @change="(v:number) => setAttrs({'barWidth': v})"
          placeholder="请输入"
        />
      </div>
    </div>

    <!-- 端点 -->
    <div>
      <div class="mb-3 mt-2 text-[#979797]">端点</div>
      <div class="flex justify-around">
        <template v-for="item in ['normal', 'round']" :key="item">
          <div
            class="bg-[#595959] w-full h-[26px] rounded flex items-center justify-center mr-2"
            :class="{
              '!bg-[#0469FF]': shape.attrs.endingStyle == item
            }"
            @click="() => setAttrs({ endingStyle: item as 'normal' })"
          >
            <div
              class="w-[33px] h-[14px] bg-[#CCCCCC] border border-black"
              :class="{
                'rounded-l-[7px]': item == 'round'
              }"
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- 起始角度等 -->
  <div class="h-[1px] w-full bg-black-border px-4 mt-6"></div>
  <div class="px-4">
    <div class="my-3 text-white font-semibold">特性</div>
    <template v-if="shape.attrs['type'] == 'arc'">
      <div class="text-[12px] text-[#979797] my-3">范围</div>
      <div class="flex justify-between">
        <div
          v-for="item in progressRangeItems"
          :key="item.icon"
          @click="
            () =>
              setAttrs({
                angleStart: item.start,
                angleEnd: item.end
              })
          "
        >
          <Icon :icon="item.icon" :width="24" :height="24" fill="none" />
        </div>
      </div>
      <div class="flex my-4">
        <div class="flex w-1/2 items-center">
          <div class="text-[12px] text-[#979797] flex-shrink-0">开始</div>
          <div class="mx-5">
            <a-input-number
              class="text-base bg-transparent"
              :defaultValue="shape.attrs['angleStart']"
              :formatter="(value: any) => `${value}°`"
              @change="(val:number) => setAttrs({'angleStart':val})"
            />
          </div>
        </div>
        <div class="flex w-1/2 items-center">
          <div class="text-[12px] text-[#979797] flex-shrink-0">结束</div>
          <div class="mx-5">
            <a-input-number
              class="text-base bg-transparent"
              :defaultValue="shape.attrs['angleEnd']"
              :formatter="(value: any) => `${value}°`"
              @change="(val:number) => setAttrs({'angleEnd':val})"
            />
          </div>
        </div>
      </div>
    </template>

    <div class="flex my-4 items-center">
      <div class="text-[12px] text-[#979797]">当前进度</div>
      <div class="mx-5">
        <a-input-number
          class="text-base bg-transparent"
          :defaultValue="shape.attrs['progress']"
          :formatter="(value: any) => `${value}%`"
          :step="5"
          :min="0"
          :max="100"
          @change="(val:number) => setAttrs({'progress':val})"
        />
      </div>
    </div>
    <div class="text-[12px] text-[#979797]">方向</div>
    <div class="w-1/2 my-2">
      <BaseSelect
        :value="shape.attrs['dir']"
        :data="
          shape.attrs['type'] == 'arc'
            ? [
                { label: '顺时针', value: 'clockwise' },
                { label: '逆时针', value: 'counter-clockwise' }
              ]
            : [
                { label: '从左到右', value: 'to-right' },
                { label: '从右到左', value: 'to-left' }
              ]
        "
        @select="(item:BaseSelectItem)=>setAttrs({'dir':item.value as 'clockwise'})"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Shape } from '@/services/shape';
import { ProgressBarAttribute } from '@/services/shape/attributes/progress-bar';
import { PropType } from 'vue';

const props = defineProps({
  shape: {
    type: Object as PropType<Shape>,
    required: true
  }
});

const progressRangeItems: {
  start: number;
  end: number;
  icon: string;
}[] = [
  {
    icon: 'progress_range1.svg',
    start: -22.5,
    end: 22.5
  },
  {
    icon: 'progress_range2.svg',
    start: 90 - 22.5,
    end: 90 + 22.5
  },
  {
    icon: 'progress_range3.svg',
    start: 135 - 22.5,
    end: 135 + 22.5
  },
  {
    icon: 'progress_range4.svg',
    start: 45 - 22.5,
    end: 45 + 22.5
  },
  {
    icon: 'progress_range5.svg',
    start: 45,
    end: 135
  },
  {
    icon: 'progress_range6.svg',
    start: -45,
    end: 45
  }
];

const typeList = [
  { label: '圆形进度条', value: 'arc' },
  { label: '直线进度条', value: 'line' }
];

const setAttrs = (data: Partial<ProgressBarAttribute>) => {
  console.log('set', data);

  props.shape?.setAttrs(data);
};
</script>
