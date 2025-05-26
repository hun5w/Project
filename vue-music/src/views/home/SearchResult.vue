<template>
  <div class="playlist-detail p-6 bg-gradient">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="title">搜索结果：{{ keyword }}</h1>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="songs.length === 0" class="empty">暂无歌曲</div>

    <ul v-else class="song-list">
      <li
        v-for="song in songs"
        :key="song.id"
        class="song-item"
        @click="playSong(song)"
        tabindex="0"
        @keydown.enter="playSong(song)"
      >
        <span class="song-name">{{ song.name }}</span>
        <span class="song-artist">- {{ song.ar.map(a => a.name).join(', ') || '未知歌手' }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloudSearch } from '@/api/search'
import { usePlayerStore } from '@/store/player'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

const keyword = ref(route.query.keyword || '')
const songs = ref([])
const loading = ref(false)

const search = async () => {
  const kw = route.query.keyword?.trim()
  if (!kw) {
    songs.value = []
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await cloudSearch({ keywords: kw, type: 1 }) // 只搜单曲
    console.log('搜索接口响应', res)
    if (res.data.code === 200 && res.data.result && res.data.result.songs) {
      songs.value = res.data.result.songs
      console.log('找到歌曲数量:', songs.value.length)
    } else {
      songs.value = []
      console.warn('没有搜索到歌曲')
    }
  } catch (e) {
    console.error('搜索失败', e)
    songs.value = []
  } finally {
    loading.value = false
  }
}


const playSong = (song) => {
  playerStore.setPlaylist(songs.value.map(s => s.id))
  const index = songs.value.findIndex(s => s.id === song.id)
  playerStore.setCurrentIndex(index)
  playerStore.setPlaying(true)
  router.push(`/song/${song.id}`)
}

const goBack = () => router.back()

onMounted(() => {
  if (keyword.value) search()
})

watch(() => route.query.keyword, (newKw) => {
  keyword.value = newKw
  search()
})
</script>

<style scoped>
/* 样式同之前保持一致... */
.p-6 {
  padding: 1.5rem;
  background-color: #fff;
  min-height: 100vh;
  font-family: "微软雅黑", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #222;
  line-height: 1.4;
}
.back-btn {
  margin-bottom: 1rem;
  padding: 0.35rem 0.9rem;
  font-size: 14px;
  color: #d81e06;
  border: 1.8px solid #d81e06;
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: inline-block;
}
.back-btn:hover {
  background-color: #d81e06;
  color: #fff;
  box-shadow: 0 0 6px #d81e06aa;
}
h1.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1.2rem;
  text-align: center;
  color: #111;
  letter-spacing: 0.05em;
}
.loading,
.empty {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 1.5rem;
  font-weight: 500;
}
.song-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 100%;
}
.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.25s ease;
  font-size: 14px;
  color: #333;
  user-select: none;
}
.song-item:hover {
  background-color: #ffdada;
  color: #d81e06;
}
.song-item .song-name {
  font-weight: 600;
  max-width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.song-item .song-artist {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  user-select: none;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d81e06;
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background-color: #f7f7f7;
}
</style>
