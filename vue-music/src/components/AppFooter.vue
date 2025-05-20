<template>
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/home">
        推荐
      </van-tabbar-item>
      <van-tabbar-item icon="music-o" to="/finding">
        发现
      </van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/note">
        笔记
      </van-tabbar-item>
      <van-tabbar-item icon="contact" to="/mine">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </template>
  
  <script>
  export default {
    name: 'AppFooter',
  }
  </script>
  