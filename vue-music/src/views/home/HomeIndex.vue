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
      this.$router.push({
      path: '/search',
      query: { keyword: this.searchKeyword.trim() }
      });
   }
  }
};
</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5; // 柔和背景色

  .header {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%);
    gap: 12px;
    box-shadow: 0 4px 12px rgba(255, 126, 95, 0.3);
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;

    .location {
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: 700;
      font-size: 22px;

      .music-icon {
        margin-right: 10px;
        font-size: 24px;
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
      }
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      padding: 8px 16px;
      color: #fff;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;

      &:focus-within {
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 0 8px rgba(255, 126, 95, 0.6);
        color: #333;

        input::placeholder {
          color: #aaa;
          opacity: 1;
        }

        .search-icon {
          color: #ff7e5f;
        }
      }

      input {
        flex: 1;
        border: none;
        background: transparent;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        outline: none;
        padding-right: 8px;
        transition: color 0.3s ease;

        &::placeholder {
          color: #ffe4d6;
          opacity: 0.8;
          transition: color 0.3s ease, opacity 0.3s ease;
        }
      }

      .search-icon {
        font-size: 22px;
        cursor: pointer;
        color: #fff;
        flex-shrink: 0;
        transition: color 0.3s ease;

        &:hover {
          color: #ff6f48;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px 24px;

    /* 推荐歌单卡片样式示例 */
    /* 你可以在RecommendPlaylist组件中自行配合 */
    .playlist-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
      padding: 16px;
      margin-bottom: 20px;
      transition: box-shadow 0.3s ease, transform 0.2s ease;
      cursor: pointer;

      &:hover {
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
        transform: translateY(-3px);
      }
    }
  }

  .footer {
    flex-shrink: 0;
    padding: 12px 0;
    background: linear-gradient(90deg, #ff7e5f, #feb47b);
    box-shadow: 0 -4px 10px rgba(255, 126, 95, 0.4);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
}

</style>
