<template>
  <div class="h-full py-4 overflow-auto">
    <div class="text-black-50">
      数字
      <input
        class=""
        type="number"
        id="tentacles"
        name="tentacles"
        min="10"
        max="100"
      />
    </div>
    <div class="mt-4">
      日期
      <input
        type="date"
        id="start"
        name="trip-start"
        value="2018-07-22"
        min="2018-01-01"
        max="2018-12-31"
      />
    </div>
    <div class="mt-4">
      日期+时间
      <input
        type="datetime-local"
        id="meeting-time"
        name="meeting-time"
        value="2018-06-12T19:30"
        min="2018-06-07T00:00"
        max="2018-06-14T00:00"
      />
    </div>
    <div class="mt-4">
      月
      <input
        type="month"
        id="start"
        name="start"
        min="2018-03"
        value="2018-05"
      />
    </div>
    <div class="mt-4">
      滑动输入条
      <input
        type="range"
        id="cowbell"
        name="cowbell"
        min="0"
        max="100"
        value="90"
        step="10"
      />
    </div>
    <div class="mt-4">
      时间
      <input
        type="time"
        id="appt"
        name="appt"
        min="09:00"
        max="18:00"
        required
      />
    </div>
    <div class="mt-4">
      周
      <input
        type="week"
        min="2018-W18"
        max="2018-W26"
        value="2018-W20"
        required
      />
    </div>
    <!-- <slide-input
          :init-value="0"
          :max-value="24"
          :current-value="10"
          :is-mixed="false"
        ></slide-input> -->
  </div>
</template>
<script lang="ts" setup></script>

<style scoped></style>
