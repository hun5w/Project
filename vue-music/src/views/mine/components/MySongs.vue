<template>
  <div class="playlist-detail p-6 bg-gradient">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="title">歌单详情：{{ playlist.name }}</h1>

    <!-- 上传本地 MP3 按钮（仅限自建歌单） -->
    <div v-if="playlist.isMine" class="upload-local">
      <label class="upload-btn">
        上传本地 MP3
        <input type="file" accept=".mp3" @change="handleUpload" hidden />
      </label>
    </div>

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

        <!-- 只有自建歌单才显示删除按钮 -->
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

const route   = useRoute()
const router  = useRouter()
const player  = usePlayerStore()
const history = useHistoryStore()

const playlist = ref({ name: '', songs: [], isMine: false })
const loading  = ref(true)

function loadDefaultPlaylist() {
  playlist.value = {
    id: 0,
    name: '本地测试用歌单',
    isMine: false,
    songs: defaultSongs.map(s => ({
      ...s,
      artists: Array.isArray(s.artists) ? s.artists : [s.artist]
    }))
  }
}

function fetchPlaylist() {
  loading.value = true
  const idStr = route.params.playlistId

  if (idStr === '0') {
    loadDefaultPlaylist()
    loading.value = false
    return
  }

  try {
    const saved = localStorage.getItem('user_playlists')
    const lists = saved ? JSON.parse(saved) : []
    const found = lists.find(p => p.id.toString() === idStr)
    if (found) {
      playlist.value = { ...found, isMine: true }
    } else {
      playlist.value = { name: '未知歌单', songs: [], isMine: false }
    }
  } catch (e) {
    playlist.value = { name: '加载失败', songs: [], isMine: false }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function goToSong(songId) {
  const idx = playlist.value.songs.findIndex(s => s.id === songId)
  if (idx === -1) return
  player.setPlaylist(playlist.value.songs)
  player.setCurrentIndex(idx)
  player.setPlaying(true)
  history.addSong(playlist.value.songs[idx])
  router.push(`/song/${songId}`)
}

function removeSong(index) {
  playlist.value.songs.splice(index, 1)
  const saved = localStorage.getItem('user_playlists')
  const lists = saved ? JSON.parse(saved) : []
  const idx = lists.findIndex(p => p.id.toString() === route.params.playlistId)
  if (idx !== -1) {
    lists[idx].songs = playlist.value.songs
    localStorage.setItem('user_playlists', JSON.stringify(lists))
  }
}

function handleUpload(event) {
  const file = event.target.files[0]
  if (!file || !file.name.endsWith('.mp3')) {
    alert('请选择一个 MP3 文件')
    return
  }

  const url = URL.createObjectURL(file)
  const song = {
    id: Date.now(), // 用时间戳模拟唯一 ID
    name: file.name.replace(/\.mp3$/i, ''),
    artists: ['本地上传'],
    url,
    source: 'local'
  }

  playlist.value.songs.push(song)

  const saved = localStorage.getItem('user_playlists')
  const lists = saved ? JSON.parse(saved) : []
  const idx = lists.findIndex(p => p.id.toString() === route.params.playlistId)
  if (idx !== -1) {
    lists[idx].songs = playlist.value.songs
    localStorage.setItem('user_playlists', JSON.stringify(lists))
  }

  event.target.value = '' // 允许再次选择相同文件
}

onMounted(fetchPlaylist)
</script>

<style scoped>
.p-4 {
  padding: 1rem;
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

h1 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1.2rem;
  text-align: center;
  color: #111;
  letter-spacing: 0.05em;
}

.upload-local {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.upload-btn {
  background-color: #d81e06;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.upload-btn:hover {
  background-color: #b71403;
}

.text-gray-500,
.text-gray-400 {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 1.5rem;
  font-weight: 500;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 100%;
}

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

li span:first-child {
  font-weight: 600;
  max-width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

li span:last-child {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  user-select: none;
}

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
