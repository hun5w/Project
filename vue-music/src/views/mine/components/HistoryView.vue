<template>
  <div class="p-4">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="title">播放历史</h1>

    <div v-if="!history || history.length === 0" class="text-gray-500">暂无播放记录</div>


    <ul v-else>
      <li
        v-for="song in history"
        :key="song.id"
        @click="goToSong(song.id)"
        tabindex="0"
        @keydown.enter="goToSong(song.id)"
      >
        <span class="song-name">{{ song.name }}</span>
        <span class="song-artist">- {{ song.artists?.join(', ') }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { useHistoryStore } from '@/store/history'
import { computed ,onMounted} from 'vue'

const router = useRouter()
const playerStore = usePlayerStore()
const historyStore = useHistoryStore()

// 历史记录来自 Pinia
const history = computed(() => historyStore.songs)

function goBack() {
  router.back()
}

function goToSong(songId) {
  const index = history.value.findIndex(s => s.id === songId)
  if (index === -1) return
  
  const song = history.value[index]


  historyStore.addSong(song)

  playerStore.setPlaylist(history.value.map(s => s.id))
  playerStore.setCurrentIndex(index)
  playerStore.setPlaying(true)

  router.push({ path: `/song/${songId}` })
}

onMounted(() => {
  historyStore.refresh()
})
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

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1.2rem;
  text-align: center;
  color: #111;
  letter-spacing: 0.05em;
}

.text-gray-500 {
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
