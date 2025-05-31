<template>
  <div class="playlist-detail p-6 bg-gradient">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="title">歌单详情：{{ playlist.name }}</h1>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!playlist.songs || playlist.songs.length === 0" class="empty">暂无歌曲</div>

    <ul v-else class="song-list">
      <li
        v-for="(song, index) in playlist.songs"
        :key="song.id"
        class="song-item"
        tabindex="0"
        @keydown.enter="goToSong(song.id)"
      >
        <div @click="goToSong(song.id)" style="flex:1; cursor:pointer;">
          <span class="song-name">{{ song.name }}</span>
          <span class="song-artist">- {{ song.artists.join(', ') }}</span>
        </div>

        <button
          v-if="playlist.isMine"
          @click.stop="removeSong(index)"
          aria-label="删除歌曲"
          class="delete-btn"
        >删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { useHistoryStore } from '@/store/history'
import { defaultSongs } from '@/data/defaultSongs'

const route = useRoute()
const router = useRouter()
const playlistId = parseInt(route.params.playlistId)
const playlist = ref({ name: '', songs: [], isMine: false })
const loading = ref(true)

const playerStore = usePlayerStore()
const historyStore = useHistoryStore()


async function fetchPlaylist() {
  loading.value = true
  try {
    // 从本地存储获取用户歌单列表
    const saved = localStorage.getItem('user_playlists')
    const localPlaylists = saved ? JSON.parse(saved) : []

    const target = localPlaylists.find(p => p.id.toString() === route.params.playlistId)
    if (target) {
      playlist.value = {
        name: target.name,
        songs: target.songs || [],
        isMine: true
      }
    } else {
      // 若本地找不到，显示空歌单（或根据需求改为调用接口）
      playlist.value = { name: '', songs: [], isMine: false }
    }
  } catch (err) {
    playlist.value = { name: '', songs: [], isMine: false }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function goToSong(songId) {
  const index = playlist.value.songs.findIndex(s => s.id === songId)
  if (index === -1) return

  playerStore.setPlaylist(playlist.value.songs.map(s => s.id))
  playerStore.setCurrentIndex(index)
  playerStore.setPlaying(true)

  const song = playlist.value.songs[index]
  historyStore.addSong(song)

  router.push({ path: `/song/${songId}` })
}

function removeSong(index) {
  playlist.value.songs.splice(index, 1)

  // 更新本地存储
  const saved = localStorage.getItem('user_playlists')
  const localPlaylists = saved ? JSON.parse(saved) : []

  const idx = localPlaylists.findIndex(p => p.id.toString() === route.params.playlistId)
  if (idx !== -1) {
    localPlaylists[idx].songs = playlist.value.songs
    localStorage.setItem('user_playlists', JSON.stringify(localPlaylists))
  }
}

onMounted(() => {
  if (playlistId === 0) {
    playlist.value = {
      id: 0,
      name: '精选推荐',
      songs: defaultSongs
    }
  } else {
    const userPlaylists = JSON.parse(localStorage.getItem('user_playlists') || '[]')
    const found = userPlaylists.find(p => p.id === playlistId)
    if (found) playlist.value = found
  }
})
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
  cursor: default;
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

/* 删除按钮 */
.delete-btn {
  background-color: transparent;
  border: none;
  color: #d81e06;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}
.delete-btn:hover {
  background-color: #d81e06;
  color: #fff;
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
