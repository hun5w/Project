<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="location">
        <van-icon name="music-o" class="music-icon"/>
        <span>推荐</span>
      </div>
      <div class="search-box">
        <input type="text" placeholder="搜索歌曲、歌手、专辑" />
        <van-icon name="search" />
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <HomeBanner :banners="banners" />
      <RecommendPlaylist :playlists="playlists" />
    </main>
    
    <footer class="footer">
      <AppFooter />
    </footer>
  </div>
</template>

<script>
import AppFooter from "../../components/AppFooter.vue";
import HomeBanner from "./components/HomeBanner.vue";
import RecommendPlaylist from "./components/RecommendPlaylist.vue";
import { getBanners, getRecommendPlaylists } from "@/api/home";

export default {
  components: {
    AppFooter,
    HomeBanner,
    RecommendPlaylist,
  },
  data() {
    return {
      banners: [],
      playlists: [],
    };
  },
  async mounted() {
    try {
      const bannerRes = await getBanners();
      this.banners = bannerRes.banners || [];

      const playlistRes = await getRecommendPlaylists();
      this.playlists = playlistRes.result || [];
    } catch (error) {
      console.error("请求网易云API失败:", error);
    }
  },
};
</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    gap: 12px;

    .location {
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: 600;
      font-size: 18px;

      .music-icon {
        margin-right: 8px;
        font-size: 20px;
      }
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 6px 12px;
      color: #fff;

      input {
        flex: 1;
        border: none;
        background: transparent;
        color: #fff;
        outline: none;
        font-size: 14px;

        &::placeholder {
          color: #eee;
        }
      }

      van-icon {
        font-size: 18px;
        flex-shrink: 0;
      }
    }
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    background-color: #f9f9f9;
    padding: 16px;
  }

  .footer {
    flex-shrink: 0;
  }
}
</style>
