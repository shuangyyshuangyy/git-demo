<template>
  <div class="h-full p-4 overflow-auto">
    <div class="flex justify-between items-center my-4">
      <div>时间</div>
      <div class="w-[130px]">
        <input
          class="w-full text-black-50"
          type="time"
          step="1"
          :value="timeValue"
          @change="(e) => onChangeTime(e)"
          required
        />
      </div>
    </div>
    <div class="mt-4 w-full">
      <input
        class="w-full"
        type="range"
        min="0"
        max="86399"
        :value="timeRangeValue"
        @change="(e) => onChangeTimeRange(e)"
        step="1"
      />
    </div>
    <div class="flex justify-between items-center my-4">
      <div>月份</div>
      <div class="w-[130px]">
        <input
          class="w-full text-black-50"
          type="month"
          :value="monthValue"
          @change="(e) => onChangeMonth(e)"
        />
      </div>
    </div>
    <div class="mt-4 w-full">
      <input
        class="w-full"
        type="range"
        min="1"
        max="12"
        :value="monthRangeValue"
        @change="(e) => onChangeMonthRange(e)"
        step="1"
      />
    </div>
    <div class="flex justify-between items-center my-4">
      <div>日期</div>
      <div class="w-[130px]">
        <input
          class="w-full text-black-50"
          type="date"
          :value="dateValue"
          @change="(e) => onChangeDate(e)"
        />
      </div>
    </div>
    <div class="mt-4 w-full">
      <input
        class="w-full"
        type="range"
        min="1"
        :max="maxDate"
        :value="dateRangeValue"
        @change="(e) => onChangeDateRange(e)"
        step="1"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const timeValue = ref('18:00:00');
const timeRangeValue = ref(64800);
const onChangeTime = (e: Event) => {
  const currentTime = (e.target as HTMLInputElement)?.value;
  timeValue.value = currentTime;
  const timeArray = timeValue.value.split(':');
  timeRangeValue.value =
    3600 * parseInt(timeArray[0]) +
    60 * parseInt(timeArray[1]) +
    parseInt(timeArray[2]);
  // console.log(timeRangeValue.value);
};
const onChangeTimeRange = (e: Event) => {
  const currentRange = (e.target as HTMLInputElement)?.value ?? 0;
  timeRangeValue.value = +currentRange;
  const hour = Math.floor(timeRangeValue.value / 3600);
  const minute = Math.floor((timeRangeValue.value % 3600) / 60);
  const second = Math.floor((timeRangeValue.value % 3600) % 60);

  timeValue.value =
    '' + numTrans(hour) + ':' + numTrans(minute) + ':' + numTrans(second);

  // console.log(timeValue.value);
};
const numTrans = (num: number) => {
  if (num > 9) return num;
  else return '0' + num;
};

const monthValue = ref('2023-04');
const monthRangeValue = ref(4);
const onChangeMonth = (e: Event) => {
  const currentMonth = (e.target as HTMLInputElement)?.value ?? '0';
  monthValue.value = currentMonth;
  const monthArray = monthValue.value.split('-');
  monthRangeValue.value = parseInt(monthArray[1]);
  console.log(monthRangeValue.value);
};
const onChangeMonthRange = (e: Event) => {
  const currentRange = (e.target as HTMLInputElement)?.value ?? 0;
  monthRangeValue.value = +currentRange;
  const monthArray = monthValue.value.split('-');
  monthValue.value = '' + monthArray[0] + '-' + numTrans(monthRangeValue.value);

  console.log(monthValue.value);
};

const dateValue = ref('2023-04-07');
const dateRangeValue = ref(7);
const maxDate = ref(30);
const onChangeDate = (e: Event) => {
  const currentDate = (e.target as HTMLInputElement)?.value ?? '0';
  dateValue.value = currentDate;
  const dateArray = dateValue.value.split('-');
  console.log(dateArray[0], dateArray[1], dateArray[2]);
  maxDate.value = getDaysOfMonth(
    parseInt(dateArray[0]),
    parseInt(dateArray[1])
  );
  console.log(maxDate.value);
  dateRangeValue.value = parseInt(dateArray[2]);
  console.log(dateRangeValue.value);
};
const onChangeDateRange = (e: Event) => {
  const currentRange = (e.target as HTMLInputElement)?.value ?? 0;
  dateRangeValue.value = +currentRange;
  const dateArray = dateValue.value.split('-');
  dateValue.value =
    '' +
    dateArray[0] +
    '-' +
    dateArray[1] +
    '-' +
    numTrans(dateRangeValue.value);

  console.log(dateValue.value);
};
const getDaysOfMonth = (year: number, month: number) => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
    default:
      return 0;
  }
};
</script>
<style scoped>
[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  outline: 0;
  background-color: transparent;
}
[type='range']::-webkit-slider-runnable-track {
  height: 4px;
  background: rgb(85, 82, 82);
}
[type='range' i]::-webkit-slider-container {
  height: 20px;
  overflow: hidden;
}
[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid transparent;
  margin-top: -3px;
  border-image: linear-gradient(white, white) 0 fill / 3 10 3 0 / 0px 0px 0
    2000px;
}
</style>
