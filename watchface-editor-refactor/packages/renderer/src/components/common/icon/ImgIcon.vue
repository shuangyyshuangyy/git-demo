<template>
  <div class="inline-block">
    <img :width="width" :src="imgUrl" alt="" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 25
  }
});
const imgUrl = new URL(`../../../assets/icons/${props.icon}`, import.meta.url)
  .href;
</script>
