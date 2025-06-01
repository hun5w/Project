<template>
  <div class="lyrics-wrapper" ref="lyricsContainer">
    <div
      v-for="(line, index) in safeParsedLyrics"
      :key="index"
      :ref="el => {
        // 保护：确保 lyricLines.value 已初始化且是数组
        if (!Array.isArray(lyricLines.value)) return
        if (el) lyricLines.value[index] = el
        else lyricLines.value[index] = null
      }"
      :class="['lyric-line', { active: index === currentLyricIndex }]"
    >
      {{ line.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()

const currentLyricIndex = ref(0)
const lyricsContainer = ref(null)
const lyricLines = ref([])

// 安全计算歌词列表，确保不为null
const safeParsedLyrics = computed(() => playerStore.parsedLyrics || [])

// 监听歌词数量变化，重置 lyricLines 数组长度
watch(
  () => safeParsedLyrics.value.length,
  async (newLen) => {
    lyricLines.value = Array(newLen).fill(null)
    // 等待 DOM 更新，确保 v-for 里的 :ref 被调用，lyricLines 得到赋值
    await nextTick()
  },
  { immediate: true }
)

const syncLyric = () => {
  const time = playerStore.currentTime
  const lines = safeParsedLyrics.value

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
  const el = lyricLines.value[currentLyricIndex.value]
  if (el && lyricsContainer.value) {
    const container = lyricsContainer.value
    const offset = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2
    container.scrollTo({ top: offset, behavior: 'smooth' })
  }
}

let timer = null
onMounted(() => {
  timer = setInterval(syncLyric, 500)
})

onBeforeUnmount(() => {
  clearInterval(timer)
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
  white-space: normal; /* 确保正常换行 */
  word-break: break-word;
}

.lyric-line.active {
  color: #000000; 
  font-weight: bold;
  font-size: 18px;
}

p {
  margin: 8px 0;
  font-size: 16px;
  color: #444;
  transition: all 0.3s ease;
}
p.active {
  color: #e91e63;
  font-weight: bold;
  font-size: 20px;
}

</style>
