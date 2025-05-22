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

// 新增：点击歌单跳转详情页，假设详情路由是 /playlist/detail/:id
function goToPlaylistDetail(id) {
  router.push({ path: `/playlist/detail/${id}` })
}
</script>

<style scoped>
/* 保持你原有的样式 */
.category-detail-container {
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.back-btn {
  width: 36px;
  height: 36px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.back-btn:hover {
  background-color: #e0e7ff;
  box-shadow: 0 4px 10px rgb(59 130 246 / 0.4);
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #4f46e5;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 144px;
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

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.playlist-item {
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.playlist-item:hover {
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.15);
}

.cover-img {
  width: 100%;
  height: 112px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.playlist-name {
  font-size: 13px;
  font-weight: 500;
  color: #444;
  padding: 8px 8px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.play-count {
  font-size: 11px;
  color: #999;
  padding: 0 8px 8px;
  user-select: none;
}
</style>
