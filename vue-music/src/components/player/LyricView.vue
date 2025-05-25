<template>
  <div class="lyric-container" ref="lyricContainer" style="height: 200px; overflow-y: auto; padding: 0 10px;">
    <p
      v-for="(line, index) in parsedLyrics"
      :key="index"
      :class="{ 'active-lyric': currentLineIndex === index }"
      :ref="el => lyricLines[index] = el"
      class="lyric-line"
      style="margin: 6px 0; transition: color 0.3s;"
    >
      {{ line.text }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  lyrics: String,       // 原始歌词文本
  audioRef: Object      // 绑定的audio元素
})

const parsedLyrics = ref([])   // [{time: Number, text: String}]
const currentLineIndex = ref(0)
const lyricLines = ref([])     // 存储每行歌词的DOM元素
const lyricContainer = ref(null)

// 解析歌词文本，提取时间和歌词内容
function parseLyrics(rawLyrics) {
  if (!rawLyrics) return []
  const lines = rawLyrics.split('\n')
  const result = []
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  lines.forEach(line => {
    const match = line.match(timeReg)
    if (match) {
      const min = parseInt(match[1])
      const sec = parseInt(match[2])
      let ms = match[3]
      if (ms.length === 2) ms = ms + '0'  // 毫秒补齐到3位
      const time = min * 60 + sec + parseInt(ms) / 1000
      const text = line.replace(timeReg, '').trim()
      result.push({ time, text })
    }
  })

  // 按时间升序排序
  return result.sort((a, b) => a.time - b.time)
}

// 音频播放时间更新，切换高亮歌词
function onTimeUpdate() {
  if (!props.audioRef) return
  const currentTime = props.audioRef.currentTime

  for (let i = parsedLyrics.value.length - 1; i >= 0; i--) {
    if (currentTime >= parsedLyrics.value[i].time) {
      if (currentLineIndex.value !== i) {
        currentLineIndex.value = i
        scrollToLine(i)
      }
      break
    }
  }
}

// 滚动歌词容器，使高亮歌词居中显示
function scrollToLine(index) {
  if (!lyricContainer.value || !lyricLines.value[index]) return
  const container = lyricContainer.value
  const lineEl = lyricLines.value[index]

  const containerHeight = container.clientHeight
  const lineOffset = lineEl.offsetTop
  const lineHeight = lineEl.offsetHeight

  const targetScrollTop = lineOffset - containerHeight / 2 + lineHeight / 2
  container.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (props.lyrics) {
    parsedLyrics.value = parseLyrics(props.lyrics)
  }
  if (props.audioRef) {
    props.audioRef.addEventListener('timeupdate', onTimeUpdate)
  }
})

onBeforeUnmount(() => {
  if (props.audioRef) {
    props.audioRef.removeEventListener('timeupdate', onTimeUpdate)
  }
})

watch(() => props.lyrics, (newVal) => {
  parsedLyrics.value = parseLyrics(newVal)
  currentLineIndex.value = 0
})
</script>

<style scoped>
.active-lyric {
  color: #3b82f6;
  font-weight: bold;
}
</style>
