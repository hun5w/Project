<template>
  <van-swipe :autoplay="3000" indicator-color="white" class="banner-container">
    <van-swipe-item v-for="item in banners" :key="item.pic">
      <img :src="item.pic" class="banner-img" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  props: {
    banners: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.banner-container {
  width: 100%;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block; /* 避免 inline 元素空隙 */
  border-radius: 8px;
}
</style>
