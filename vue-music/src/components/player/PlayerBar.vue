<template>
  <div class="player-bar" v-if="hasSong && visible">
    <div class="song-info" @click="goToSongDetail">
      <div class="song-name" :title="currentSongName">{{ currentSongName }}</div>
      <div class="song-artists" :title="currentSongArtists">{{ currentSongArtists }}</div>
    </div>
    <div class="controls">
      <button @click="prevSong">⏮</button>
      <button @click="togglePlay">{{ playing ? '⏸' : '▶' }}</button>
      <button @click="nextSong">⏭</button>
    </div>
    <!-- 新增进度条 -->
    <input
      type="range"
      min="0"
      :max="duration"
      step="0.1"
      v-model.number="localCurrentTime"
      @change="onSeek"
    />
    <div class="time-info">{{ formatTime(localCurrentTime) }} / {{ formatTime(duration) }}</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { usePlayerStore } from '@/store/player'
import { useRouter } from 'vue-router'

const player = usePlayerStore()
const router = useRouter()

const hasSong = computed(() => player.playlist.length > 0)
const playing = computed(() => player.playing)
const currentSongName = computed(() => {
  const song = player.playlist[player.currentIndex]
  return song ? song.name : '无歌曲'
})
const currentSongArtists = computed(() => {
  const song = player.playlist[player.currentIndex]
  return song ? song.ar.map(a => a.name).join(', ') : ''
})

const localCurrentTime = ref(player.currentTime)
const duration = computed(() => player.duration)

watch(() => player.currentTime, val => {
  localCurrentTime.value = val
})

function togglePlay() {
  player.togglePlay()
}

function nextSong() {
  player.next()
}

function prevSong() {
  player.prev()
}

function goToSongDetail() {
  if (player.currentSongId) {
    router.push(`/song/${player.currentSongId}`)
  }
}

function onSeek() {
  player.seek(localCurrentTime.value)
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;
  background: #d81e06;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-family: '微软雅黑', Arial, sans-serif;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.3);
  z-index: 9999;
}
.song-info {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}
.song-name {
  font-weight: bold;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-artists {
  font-size: 12px;
  color: #fcdcdc;
  overflow: hidden;
  text-overflow: ellipsis;
}
.controls button {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
}
.controls button:focus {
  outline: none;
}
input[type='range'] {
  width: 150px;
  margin-left: 10px;
  cursor: pointer;
}
.time-info {
  margin-left: 8px;
  font-size: 12px;
  user-select: none;
}
</style>
