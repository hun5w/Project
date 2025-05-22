<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="location">
        <van-icon name="music-o" class="music-icon" />
        <span>推荐</span>
      </div>
      <div class="search-box">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="搜索歌曲、歌手、专辑"
          @keyup.enter="handleSearch"
          autocomplete="off"
          spellcheck="false"
        />
        <van-icon name="search" class="search-icon" @click="handleSearch" />
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <HomeBanner v-if="banners.length" :banners="banners" />
      <RecommendPlaylist v-if="playlists.length" :playlists="playlists" />
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
      searchKeyword: '',
    };
  },

  async mounted() {
    try {
      const { data: bannerData } = await getBanners();
      this.banners = bannerData.banners || [];

      const { data: playlistData } = await getRecommendPlaylists();
      this.playlists = playlistData.result || [];
    } catch (error) {
      console.error("请求网易云API失败:", error);
    }
  },

  methods: {
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.$toast('请输入搜索关键词');
        return;
      }
      // 这里你可以实现跳转搜索页或者调用搜索接口
      console.log('搜索关键词:', this.searchKeyword);
    }
  }
};
</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;

  .header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    gap: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

    .location {
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: 700;
      font-size: 20px;

      .music-icon {
        margin-right: 8px;
        font-size: 22px;
      }
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 22px;
      padding: 8px 14px;
      color: #fff;
      transition: background 0.3s ease;

      &:focus-within {
        background: rgba(255, 255, 255, 0.4);
      }

      input {
        flex: 1;
        border: none;
        background: transparent;
        color: #fff;
        outline: none;
        font-size: 15px;
        font-weight: 500;
        padding-right: 8px;

        &::placeholder {
          color: #eee;
          opacity: 0.8;
        }
      }

      .search-icon {
        font-size: 20px;
        cursor: pointer;
        flex-shrink: 0;
        color: #fff;
        transition: color 0.3s ease;

        &:hover {
          color: #ffd1a9;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px 16px 24px;
  }

  .footer {
    flex-shrink: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }
}
</style>
