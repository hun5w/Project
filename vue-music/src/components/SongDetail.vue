<template>
  <div class="p-4 bg-white min-h-screen">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="text-xl font-bold mb-4">{{ song.name }}</h1>
    <p class="text-gray-600 mb-2">歌手：{{ song.artists.join(', ') }}</p>
    <p class="text-gray-600 mb-4">专辑：{{ song.album }}</p>

    <audio
      ref="audioPlayer"
      :src="song.url"
      controls
      autoplay
      class="w-full"
    ></audio>

    <div v-if="loading" class="text-gray-500 mt-4">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSongDetail, getSongUrl } from '@/api/song' // 你需要实现这两个API

const route = useRoute()
const router = useRouter()

const song = ref({
  name: '',
  artists: [],
  album: '',
  url: ''
})

const loading = ref(true)

async function fetchSong() {
  loading.value = true
  try {
    const detailRes = await getSongDetail(route.params.songId)
    const urlRes = await getSongUrl(route.params.songId)

    song.value.name = detailRes.data.songs[0].name
    song.value.artists = detailRes.data.songs[0].ar.map(a => a.name)
    song.value.album = detailRes.data.songs[0].al.name
    song.value.url = urlRes.data.data[0].url
  } catch (err) {
    song.value = { name: '', artists: [], album: '', url: '' }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(fetchSong)
</script>

<style scoped>
.back-btn {
  margin-bottom: 1rem;
  color: #3b82f6;
  cursor: pointer;
}
</style>
