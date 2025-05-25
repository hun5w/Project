<template>
  <audio
    ref="audio"
    :src="audioUrl"
    @ended="onEnded"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
  />
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { usePlayerStore } from '@/store/player'
import { getSongUrl } from '@/api/song'

const audio = ref(null)
const player = usePlayerStore()
const audioUrl = ref('')

watch(() => player.currentSongId, async (id) => {
  if (!id) {
    audioUrl.value = ''
    return
  }
  try {
    const res = await getSongUrl(id)
    const url = res.data.data[0]?.url

    if (!url) {
      // 版权限制，无法播放
      audioUrl.value = ''
      alert('抱歉，该歌曲无版权，无法播放。')
      return
    }
    
    audioUrl.value = url
    await nextTick()
    if (player.playing) {
      audio.value.play()
    }
  } catch (error) {
    console.error('获取歌曲播放地址失败', error)
  }
})

watch(() => player.playing, (playing) => {
  if (!audio.value) return
  playing ? audio.value.play() : audio.value.pause()
})

function onEnded() {
  player.next()
}

function onTimeUpdate() {
  player.setCurrentTime(audio.value.currentTime)
}

function onLoadedMetadata() {
  player.setDuration(audio.value.duration)
}


</script>
