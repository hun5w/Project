<template>
  <div id="app">
    <router-view /> <!-- 页面内容 -->

  

    <!-- 底部导航栏 -->
    <van-tabbar
      v-if="!isLoginPage"
      route
      active-color="#ec4141"
      inactive-color="#999"
    >
      <van-tabbar-item to="/home" icon="home-o">推荐</van-tabbar-item>
      <van-tabbar-item to="/finding" icon="music-o">发现</van-tabbar-item>
      <van-tabbar-item to="/note" icon="chat-o">笔记</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="contact">我的</van-tabbar-item>
    </van-tabbar>


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()

const isLoginPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})

const showPlayerBar = ref(true)

onMounted(() => {
  window.addEventListener('hidePlayerBar', () => {
    showPlayerBar.value = false
  })
  window.addEventListener('showPlayerBar', () => {
    showPlayerBar.value = true
  })
})
</script>


<style>
body, html, #app {
  height: 100%;
  margin: 0;
}
</style>
