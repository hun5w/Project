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
      >
        <div
          class="song-info"
          @click="goToSong(song.id)"
          tabindex="0"
          @keydown.enter="goToSong(song.id)"
        >
          <span class="song-name">{{ song.name }}</span>
          <span class="song-artist">- {{ song.artists.join(', ') }}</span>
        </div>
        <button class="add-btn" @click.stop="openAddToPlaylist(song)">+</button>
      </li>
    </ul>

    <!-- 添加到歌单对话框 -->
    <div v-if="showDialog" class="dialog" @click.self="cancelAdd">
      <div class="dialog-box">
        <h3>添加到歌单</h3>
        <ul>
          <li
            v-for="playlist in playlists"
            :key="playlist.id"
            @click="addToPlaylist(playlist.id)"
          >
            {{ playlist.name }}
          </li>
        </ul>
        <button @click="cancelAdd">取消</button>
      </div>
    </div>
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
  // 找到歌曲索引
  const index = playlist.value.songs.findIndex(s => s.id === songId)
  if (index === -1) return

  playerStore.setPlaylist(playlist.value.songs)
  playerStore.setCurrentIndex(index)
  playerStore.setPlaying(true)

  // 加入播放历史
  const song = playlist.value.songs[index]
  historyStore.addSong(song)

  router.push({ path: `/song/${songId}` })
}

// 添加到歌单相关
const showDialog = ref(false)
const targetSong = ref(null)
const playlists = ref([])

// 当前登录用户 ID，用于筛选歌单
const currentUserId = Number(localStorage.getItem('current_user_id')) || 1748691034990

function openAddToPlaylist(song) {
  targetSong.value = song
  const saved = localStorage.getItem('user_playlists')
  const all = saved ? JSON.parse(saved) : []

  playlists.value = all.filter(p => p.userId == currentUserId)
  showDialog.value = true
}

function cancelAdd() {
  showDialog.value = false
  targetSong.value = null
}

function addToPlaylist(playlistId) {
  const saved = localStorage.getItem('user_playlists')
  let allPlaylists = saved ? JSON.parse(saved) : []
  const playlist = allPlaylists.find(p => p.id === playlistId && p.userId === currentUserId)
  if (!playlist) return
  if (!playlist.songs) playlist.songs = []

  if (!playlist.songs.find(s => s.id === targetSong.value.id)) {
    playlist.songs.push(targetSong.value)
    localStorage.setItem('user_playlists', JSON.stringify(allPlaylists))
    alert('添加成功！')
  } else {
    alert('该歌曲已存在于该歌单中')
  }

  cancelAdd()
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
  cursor: default;
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

.song-info {
  flex: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.song-name {
  font-weight: 600;
  max-width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  user-select: none;
}

.add-btn {
  padding: 4px 10px;
  font-size: 18px;
  background-color: transparent;
  border: 1px solid #d81e06;
  color: #d81e06;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
}
.add-btn:hover {
  background-color: #d81e06;
  color: white;
}

/* 弹窗样式 */
.dialog {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 80vw;
  max-width: 320px;
  text-align: center;
}

.dialog-box h3 {
  margin-bottom: 15px;
  color: #C20C0C;
  font-size: 18px;
}

.dialog-box ul {
  list-style: none;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
}

.dialog-box li {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 15px;
}
.dialog-box li:hover {
  background-color: #fceeee;
  color: #d81e06;
}

.dialog-box button {
  margin-top: 12px;
  padding: 10px 20px;
  background-color: #d81e06;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 15px;
}
.dialog-box button:hover {
  background-color: #b00c0c;
}

</style>
