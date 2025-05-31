<template>
  <div class="song-detail" v-if="currentSong && currentSong.name">
    <button @click="goBack">← 返回</button>
    <h1>{{ currentSong.name }}</h1>
    <audio
      ref="audio"
      :src="songUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      controls
      autoplay
    ></audio>
  </div>
</template>



<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { getSongUrl } from '@/api/song'

const playerStore = usePlayerStore()
const router = useRouter()

// ✅ 使用 computed 获取当前歌曲
const currentSong = computed(() => playerStore.playlist[playerStore.currentIndex])
const songUrl = ref('')
const audio = ref(null)

async function loadSong() {

  if (!currentSong.value) return

  // 如果是本地歌曲，url 以 / 开头（你的约定），直接用本地路径
  if (currentSong.value.url && currentSong.value.url.startsWith('/')) {
    songUrl.value = currentSong.value.url
    return
  }

  // 否则调用接口请求网易云音乐链接
  const urlRes = await getSongUrl(currentSong.value.id)
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

watch(() => playerStore.currentTime, (newTime) => {
  if (!audio.value) return
  const diff = Math.abs(audio.value.currentTime - newTime)
  if (diff > 0.5) {
    audio.value.currentTime = newTime
  }
})

watch(() => playerStore.playing, (playing) => {
  if (!audio.value) return
  if (playing) {
    audio.value.play()
  } else {
    audio.value.pause()
  }
})

onMounted(() => {
  loadSong()
  window.dispatchEvent(new CustomEvent('hidePlayerBar'))
})

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
