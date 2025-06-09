<template>
  <div class="lyrics-wrapper" ref="lyricsContainer">
    <div
      v-for="(line, index) in lyrics"
      :key="index"
      :ref="el => {
        if (Array.isArray(lyricLines)) lyricLines[index] = el
      }"
      :class="['lyric-line', { active: index === currentLyricIndex }]"
    >
      {{ line.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick} from 'vue'

// 接收歌词和当前时间
const props = defineProps({
  lyrics: {
    type: Array,
    default: () => []
  },
  currentTime: {
    type: Number,
    default: 0
  }
})

const lyricsContainer = ref(null)
const lyricLines = []
const currentLyricIndex = ref(0)

// 歌词数量变化时，重新构建滚动元素数组
watch(
  () => props.lyrics.length,
  async (newLen) => {
    lyricLines.length = newLen
    for (let i = 0; i < newLen; i++) {
      lyricLines[i] = null
    }
    await nextTick()
  },
  { immediate: true }
)

const syncLyric = () => {
  const time = props.currentTime
  const lines = props.lyrics

  if (!Array.isArray(lines) || lines.length === 0) return

  for (let i = 0; i < lines.length; i++) {
    const current = lines[i]
    const next = lines[i + 1]
    if (time >= current.time && (!next || time < next.time)) {
      if (currentLyricIndex.value !== i) {
        currentLyricIndex.value = i
        scrollToCurrent()
      }
      break
    }
  }
}

const scrollToCurrent = () => {
  const el = lyricLines[currentLyricIndex.value]
  if (el && lyricsContainer.value) {
    const container = lyricsContainer.value
    const offset = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2
    container.scrollTo({ top: offset, behavior: 'smooth' })
  }
}

// 使用 watch 监听播放时间变化而非 setInterval
watch(() => props.currentTime, () => {
  syncLyric()
})
</script>

<style scoped>
.lyrics-wrapper {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #222;
  border-radius: 6px;
  color: #aaa;
  font-size: 16px;
  line-height: 2;
  user-select: text;
}

.lyric-line {
  margin: 8px 0;
  color: #aaa;
  transition: color 0.3s ease, font-size 0.3s ease;
  font-weight: normal;
  font-size: 16px;
  padding: 2px 0;
  white-space: normal;
  word-break: break-word;
}

.lyric-line.active {
  color: #000000;
  font-weight: bold;
  font-size: 18px;
}
</style>
