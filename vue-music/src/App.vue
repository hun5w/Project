<template>
  <div id="app">
    <router-view /> <!-- 页面内容区域 -->

    <!-- 只在非登录页显示底部导航栏 -->
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

<script>
export default {
  name: "App",
  computed: {
    // 判断当前路径是否为登录页
    isLoginPage() {
      return this.$route.path === '/login'
    }
  }
}
</script>

<style>
body, html, #app {
  height: 100%;
  margin: 0;
}
</style>
