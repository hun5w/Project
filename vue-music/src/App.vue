<template>
  <div id="app">
    <router-view /> <!-- 页面内容区域 -->
    <van-tabbar  
      route
      active-color="#ec4141"
      inactive-color="#999"> 
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
  data() {
    return {
      active: 0, // 当前激活索引，但 route 模式会自动处理
    };
  },
};
</script>

<style>
body, html, #app {
  height: 100%;
  margin: 0;
}
</style>
