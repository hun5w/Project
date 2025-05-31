<template>
  <div class="song-detail" v-if="currentSong && currentSong.name">
    <button @click="goBack">← 返回</button>
    <div class="cover-wrapper" :class="{ rotating: playing }">
      <img :src="currentSong.cover" alt="封面" class="cover" />
    </div>
    <h1 class="song-title">{{ currentSong.name }}</h1>
    <h2 class="artist-name">{{ currentSong.artist }}</h2>

    <audio
      ref="audio"
      :src="songUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      controls
      autoplay
    ></audio>

    <div class="lyrics">
      <p v-for="(line, index) in parsedLyrics" :key="index" :class="{ active: currentLyricIndex === index }">
        {{ line.text }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { getSongUrl, getSongLyric } from '@/api/song'

const playerStore = usePlayerStore()
const router = useRouter()

const audio = ref(null)
const songUrl = ref('')

// 当前播放歌曲，来自播放器全局状态
const currentSong = computed(() => playerStore.playlist[playerStore.currentIndex] || {})

// 播放状态
const playing = computed(() => playerStore.playing)

// 歌词处理相关
const rawLyrics = ref('')
const parsedLyrics = ref([]) // [{ time: 10.123, text: '歌词行' }, ...]
const currentLyricIndex = ref(0)

function parseLyrics(lyrics) {
  const lines = lyrics.split('\n')
  const result = []
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  for (const line of lines) {
    const match = timeReg.exec(line)
    if (match) {
      const min = parseInt(match[1])
      const sec = parseInt(match[2])
      const ms = parseInt(match[3].length === 3 ? match[3] : match[3] * 10)
      const time = min * 60 + sec + ms / 1000
      const text = line.replace(timeReg, '').trim()
      result.push({ time, text })
    }
  }
  return result
}

async function loadLyrics() {
  if (currentSong.value.source === 'netease' && currentSong.value.id) {
    try {
      const res = await getSongLyric(currentSong.value.id)
      rawLyrics.value = res.lrc?.lyric || ''
      parsedLyrics.value = parseLyrics(rawLyrics.value)
    } catch {
      rawLyrics.value = ''
      parsedLyrics.value = []
    }
  } else {
    // 本地歌曲暂时无歌词，清空
    rawLyrics.value = ''
    parsedLyrics.value = []
  }
}

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

  await loadLyrics()
  currentLyricIndex.value = 0
}


function goBack() {
  router.back()
}

function onTimeUpdate() {
  if (!audio.value) return
  playerStore.setCurrentTime(audio.value.currentTime)

  // 更新歌词高亮
  const currentTime = audio.value.currentTime
  for (let i = 0; i < parsedLyrics.value.length; i++) {
    if (
      currentTime >= parsedLyrics.value[i].time &&
      (i === parsedLyrics.value.length - 1 || currentTime < parsedLyrics.value[i + 1].time)
    ) {
      currentLyricIndex.value = i
      break
    }
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

watch(() => playerStore.currentIndex, () => {
  loadSong()
})

watch(playing, (val) => {
  if (!audio.value) return
  if (val) {
    audio.value.play()
  } else {
    audio.value.pause()
  }
})

onMounted(() => {
  loadSong()
  window.dispatchEvent(new CustomEvent('hidePlayerBar'))
})
</script>

<style scoped>
.song-detail {
  max-width: 500px;
  margin: auto;
  padding: 1rem;
  text-align: center;
}

.cover-wrapper {
  width: 300px;
  height: 300px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.cover-wrapper.rotating {
  animation: spin 10s linear infinite;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.artist-name {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
}

.lyrics {
  max-height: 200px;
  overflow-y: auto;
  text-align: center;
  font-size: 14px;
  color: #555;
  line-height: 1.5em;
}

.lyrics p {
  margin: 5px 0;
}

.lyrics p.active {
  color: #3b82f6;
  font-weight: bold;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
