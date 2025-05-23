<template>
  <div class="category-detail-container">
    <header class="header">
      <button class="back-btn" @click="goBack" aria-label="返回">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="back-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="title">🎵「{{ catName }}」歌单推荐</h1>
    </header>

    <div v-if="loading" class="loading">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        />
      </svg>
      加载中...
    </div>

    <div v-else-if="playlists.length === 0" class="empty">
      暂无推荐歌单，请稍后再试 🎧
    </div>

    <div v-else class="playlist-grid">
      <div
        v-for="item in playlists"
        :key="item.id"
        class="playlist-item"
        :title="item.name"
        @click="goToPlaylistDetail(item.id)"
      >
        <img
          :src="item.coverImgUrl"
          alt="歌单封面"
          class="cover-img"
        />
        <p class="playlist-name">{{ item.name }}</p>
        <p class="play-count">
          👁️ {{ item.playCount > 10000 ? (item.playCount / 10000).toFixed(1) + ' 万' : item.playCount }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylistsByCategory } from '@/api/sortplaylist'

const router = useRouter()
const route = useRoute()

const catName = ref(route.query.cat || '')
const playlists = ref([])
const loading = ref(true)

const loadData = async () => {
  if (!catName.value) return
  loading.value = true
  try {
    const res = await getPlaylistsByCategory(catName.value)
    playlists.value = res.data.playlists
  } catch (err) {
    playlists.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

watch(
  () => route.query.cat,
  (newCat) => {
    catName.value = newCat
    loadData()
  }
)

function goBack() {
  router.back()
}

function goToPlaylistDetail(id) {
  router.push({ path: `/playlist/detail/${id}` })
}
</script>

<style scoped>
/* 页面整体容器 */
.category-detail-container {
  padding: 12px 16px;
  background-color: #ffffff; /* 白色背景 */
  min-height: 100vh;
  box-sizing: border-box;
  color: #111; /* 主字体色 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 顶部 header 区域 */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

/* 返回按钮样式 */
.back-btn {
  padding: 6px 14px;
  font-size: 14px;
  color: #d81e06;
  border: 1.8px solid #d81e06;
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.back-btn:hover {
  background-color: #d81e06;
  color: #fff;
  box-shadow: 0 0 8px #d81e06cc;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #d81e06;
  margin-right: 4px;
}

/* 标题 */
.title {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 加载和空状态 */
.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  color: #999;
  font-size: 14px;
  user-select: none;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
  width: 20px;
  height: 20px;
}

.path {
  stroke: #999;
  stroke-linecap: round;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* 歌单网格 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}

/* 每个歌单卡片 */
.playlist-item {
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.playlist-item:hover {
  box-shadow: 0 6px 12px rgba(216, 30, 6, 0.2);
}

/* 歌单封面 */
.cover-img {
  width: 100%;
  height: 96px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

/* 歌单名称 */
.playlist-name {
  font-size: 13px;
  font-weight: 500;
  color: #222;
  padding: 8px 8px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 播放量 */
.play-count {
  font-size: 11px;
  color: #888;
  padding: 0 8px 8px;
  user-select: none;
}

/* 歌曲列表样式 */
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 6px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

li:hover {
  background-color: #f7f7f7;
}

li span.font-medium {
  font-weight: 600;
  color: #111;
}

li span.text-sm {
  font-size: 12px;
  color: #999;
  margin-left: 6px;
}

/* 可复用：返回按钮容器间距 */
.page-back-btn {
  margin-bottom: 1rem;
}
</style>
