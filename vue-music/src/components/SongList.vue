<template>
  <div class="playlist-detail p-6 bg-gradient">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="title">歌单详情：{{ playlist.name }}</h1>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!playlist.songs || playlist.songs.length === 0" class="empty">暂无歌曲</div>

    <ul v-else class="song-list">
      <li
        v-for="song in playlist.songs"
        :key="song.id"
        class="song-item"
        @click="goToSong(song.id)"
        tabindex="0"
        @keydown.enter="goToSong(song.id)"
      >
        <span class="song-name">{{ song.name }}</span>
        <span class="song-artist">- {{ song.artists.join(', ') }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylistDetail } from '@/api/playlist'
import { usePlayerStore } from '@/store/player'
import { useHistoryStore } from '@/store/history'

const route = useRoute()
const router = useRouter()

const playlist = ref({ name: '', songs: [] })
const loading = ref(true)

const playerStore = usePlayerStore()
const historyStore = useHistoryStore()

async function fetchPlaylist() {
  loading.value = true
  try {
    const res = await getPlaylistDetail(route.params.playlistId)
    const playlistData = res.data.playlist || { name: '', tracks: [] }
    playlist.value = {
      name: playlistData.name,
      songs: playlistData.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.ar.map(a => a.name)
      }))
    }
  } catch (err) {
    playlist.value = { name: '', songs: [] }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function goToSong(songId) {
  // 先找到点击歌曲在歌单中的索引
  const index = playlist.value.songs.findIndex(s => s.id === songId)
  if (index === -1) return // 保护

  // 设置Pinia播放列表和当前索引
  playerStore.setPlaylist(playlist.value.songs)  
  playerStore.setCurrentIndex(0)                           // 设置当前播放歌曲索引
  playerStore.setPlaying(true)                                 // 标记播放状态

  // --- 新增：加入播放历史 ---
  // 拿到当前播放歌曲的完整信息对象
  const song = playlist.value.songs[index]
  historyStore.addSong(song)  // 加入播放历史
  
  // 跳转到播放页，songId参数可以保持（可选）
  router.push({ path: `/song/${songId}` })
}

onMounted(fetchPlaylist)
</script>

<style scoped>
/* 页面整体白色背景 */
.p-4 {
  padding: 1rem;
  background-color: #fff;
  min-height: 100vh;
  font-family: "微软雅黑", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #222; /* 深灰字体 */
  line-height: 1.4;
}

/* 返回按钮 */
.back-btn {
  margin-bottom: 1rem;
  padding: 0.35rem 0.9rem;
  font-size: 14px;
  color: #d81e06; /* 网易云红 */
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

/* 标题 */
h1 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1.2rem;
  text-align: center;
  color: #111;
  letter-spacing: 0.05em;
}

/* 加载与无内容提示 */
.text-gray-500,
.text-gray-400 {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 1.5rem;
  font-weight: 500;
}

/* 歌曲列表 */
ul {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 100%;
}

/* 每首歌条目 */
li {
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
li:hover {
  background-color: #ffdada;
  color: #d81e06;
}

/* 歌名 */
li span:first-child {
  font-weight: 600;
  max-width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 艺术家名称 */
li span:last-child {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  user-select: none;
}

/* 滚动条样式 */
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
