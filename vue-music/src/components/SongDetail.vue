<template>
  <div class="song-detail">
    <button @click="goBack">← 返回</button>
    <h1>{{ song.name }}</h1>
    <audio
      ref="audio"
      :src="songUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      controls
      autoplay
    ></audio>
    <!-- 其他UI -->
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { getSongDetail, getSongUrl } from '@/api/song'

const playerStore = usePlayerStore()
const router = useRouter()

const song = ref({})
const songUrl = ref('')
const audio = ref(null)

async function loadSong() {
  if (!playerStore.currentSongId) return
  const detailRes = await getSongDetail(playerStore.currentSongId)
  song.value = detailRes.data.songs[0]
  const urlRes = await getSongUrl(playerStore.currentSongId)
  songUrl.value = urlRes.data.data[0].url
}

function goBack() {
  router.back()
}

function onTimeUpdate() {
  if (audio.value) {
    playerStore.setCurrentTime(audio.value.currentTime)
  }
}

function onEnded() {
  playerStore.next()
}

function onLoadedMetadata() {
  if (audio.value) {
    playerStore.setDuration(audio.value.duration)
  }
}

// 监听store.currentTime，如果与播放器时间不一致则更新播放器进度
watch(() => playerStore.currentTime, (newTime) => {
  if (!audio.value) return
  const diff = Math.abs(audio.value.currentTime - newTime)
  if (diff > 0.5) {
    audio.value.currentTime = newTime
  }
})

// 监听播放状态同步
watch(() => playerStore.playing, (playing) => {
  if (!audio.value) return
  if (playing) {
    audio.value.play()
  } else {
    audio.value.pause()
  }
})

// 进入页面时隐藏底部播放框
onMounted(() => {
  loadSong()
  window.dispatchEvent(new CustomEvent('hidePlayerBar'))
})

// 离开页面时显示底部播放框
onBeforeUnmount(() => {
  playerStore.setPlaying(true)
})
</script>

<style scoped>
.song-detail button {
  margin-bottom: 1rem;
  color: #3b82f6;
  cursor: pointer;
}
</style>
