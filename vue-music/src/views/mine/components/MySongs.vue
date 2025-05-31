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
    name: '精选推荐',
    isMine: false,
    // 把 artist 字段转为 artists 数组，保持模板一致
    songs: defaultSongs.map(s => ({
      ...s,
      artists: Array.isArray(s.artists) ? s.artists : [s.artist]
    }))
  }
}

function fetchPlaylist() {
  loading.value = true
  const idStr = route.params.playlistId

  // id==0 视为默认歌单
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
