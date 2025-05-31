<template>
  <div class="history-page">
    <!-- 返回按钮和清空按钮 -->
    <div class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h2>播放历史</h2>
      <button class="clear-all-btn" @click="clearAllHistory">清空</button>
    </div>

    <ul class="song-list">
      <li v-for="song in history" :key="song.id" class="song-item">
        <div @click="goToSong(song.id)" class="song-info">
          <span class="song-name">{{ song.name }}</span>
          <span class="song-artist">- {{ song.artists?.join(', ') }}</span>
        </div>
        <div class="action-btns">
          <button class="add-btn" @click.stop="openAddToPlaylist(song)">+</button>
          <button class="delete-btn" @click.stop="deleteHistory(song.id)">✖</button>
        </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { useHistoryStore } from '@/store/history'
import { onMounted } from 'vue'

onMounted(() => {
  historyStore.refresh()
})

const router = useRouter()
const playerStore = usePlayerStore()
const historyStore = useHistoryStore()
const history = computed(() => historyStore.songs)

function goToSong(songId) {
  const index = history.value.findIndex(s => s.id === songId)
  if (index === -1) return
  
  // ✅ 把整个 history 设置成播放列表
  playerStore.setPlaylist(history.value) // 注意：这里不要 .songs
  playerStore.setCurrentIndex(index)
  playerStore.setPlaying(true)
  router.push({ path: `/song/${songId}` })
}

// 当前登录用户 ID（用于筛选歌单）
const currentUserId = Number(localStorage.getItem('current_user_id')) || 1748691034990


// 添加到歌单逻辑
const showDialog = ref(false)
const targetSong = ref(null)
const playlists = ref([])

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


// 删除单条历史记录
function deleteHistory(songId) {
  if (confirm('确定要删除这条记录吗？')) {
    historyStore.removeSongById(songId)
    historyStore.refresh()  // 强制同步最新数据
    alert('删除成功')
  }
}


// 清空所有历史记录
function clearAllHistory() {
  if (confirm('确定要清空所有播放记录吗？')) {
    historyStore.clearHistory()
    alert('播放记录已清空')
  }
}
</script>

<style scoped>
.history-page {
  width: 100vw;
  min-height: 100vh;
  background: #fff5f5;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  padding-bottom: 20px;
}

.header {
  position: sticky;
  top: 0;
  background-color: #fff5f5;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1c0c0;
}

.back-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #C20C0C;
  margin-right: 10px;
  cursor: pointer;
}

h2 {
  font-size: 18px;
  color: #C20C0C;
  font-weight: bold;
}

.clear-all-btn {
  margin-left: auto;
  background-color: #d81e06;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
}
.clear-all-btn:hover {
  background-color: #b00c0c;
}

.song-list {
  list-style: none;
  padding: 0 16px;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1c0c0;
  padding: 12px 0;
}

.song-info {
  flex: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.song-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.song-artist {
  font-size: 14px;
  color: #888;
}

.action-btns {
  display: flex;
  gap: 6px;
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

.delete-btn {
  padding: 4px 10px;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #aaa;
  color: #666;
  border-radius: 50%;
  cursor: pointer;
}
.delete-btn:hover {
  background-color: #ccc;
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

/* 移动端适配优化 */
@media (max-width: 480px) {
  .song-name {
    font-size: 15px;
  }
  .song-artist {
    font-size: 13px;
  }
  .dialog-box {
    width: 90vw;
  }
}
</style>
