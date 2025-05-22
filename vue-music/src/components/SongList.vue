<template>
  <div class="p-4 bg-white min-h-screen">
    <button class="back-btn" @click="goBack" aria-label="返回">← 返回</button>
    <h1 class="text-xl font-bold mb-4">歌单详情：{{ playlist.name }}</h1>

    <div v-if="loading" class="text-gray-500">加载中...</div>
    <div v-else-if="!playlist.songs || playlist.songs.length === 0" class="text-gray-400">暂无歌曲</div>

    <ul v-else>
      <li
        v-for="song in playlist.songs"
        :key="song.id"
        class="py-2 border-b cursor-pointer hover:bg-gray-100"
        @click="goToSong(song.id)"
      >
        <span class="font-medium">{{ song.name }}</span>
        <span class="text-sm text-gray-500 ml-2">- {{ song.artists.join(', ') }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylistDetail } from '@/api/playlist' // 你需要实现这个API

const route = useRoute()
const router = useRouter()

const playlist = ref({ name: '', songs: [] })
const loading = ref(true)

async function fetchPlaylist() {
  loading.value = true
  try {
    const res = await getPlaylistDetail(route.params.playlistId)
    playlist.value = {
      name: res.data.playlist.name,
      songs: res.data.playlist.tracks.map(track => ({
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
  router.push({ path: `/song/${songId}` })
}

onMounted(fetchPlaylist)
</script>

<style scoped>
.back-btn {
  margin-bottom: 1rem;
  color: #3b82f6;
  cursor: pointer;
}
</style>
