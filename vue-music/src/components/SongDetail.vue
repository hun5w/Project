<template>
  <div class="song-detail" v-if="currentSong && currentSong.name">
    <button class="back-btn" @click="goBack">← 返回</button>

    <!-- 封面视图 -->
    <div
      v-if="!showLyrics"
      class="cover-wrapper"
      :class="{ rotating: playing }"
      @click="toggleView"
      title="点击查看歌词"
    >
      <img :src="currentSong.cover" alt="封面" class="cover" />
    </div>

    <!-- 歌词视图 -->
    <div
      v-else
      class="lyrics-wrapper"
      @click="toggleView"
      title="点击返回封面"
    >
      <LyricView :lyrics="playerStore.parsedLyrics" :currentTime="currentTime" />
    </div>

    <!-- 歌曲名和歌手 -->
    <transition name="fade">
      <div v-if="!showLyrics" class="song-info">
        <h1 class="song-title">{{ currentSong.name }}</h1>
        <h2 class="artist-name">{{ currentSong.artist }}</h2>
      </div>
    </transition>

    <audio
      ref="audio"
      :src="songUrl"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      controls
      autoplay
      class="audio-player"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { getSongUrl, getLyric, getSongDetail } from '@/api/song'
import LyricView from './LyricView.vue'
import { parseLyrics } from '@/utils/parseLyric'

const playerStore = usePlayerStore()
const router = useRouter()

const audio = ref(null)
const songUrl = ref('')
const rawLyrics = ref('')
const showLyrics = ref(false)

const currentSong = computed(() => playerStore.playlist[playerStore.currentIndex] || {})
const playing = computed(() => playerStore.playing)
const currentTime = computed(() => playerStore.currentTime)

function toggleView() {
  showLyrics.value = !showLyrics.value
}



async function loadSong() {
  if (!currentSong.value) return;

  const song = currentSong.value;
  console.log('currentSong:', song);

  // 确定 songId
  let songId = null;
  if (typeof song === 'number' || typeof song === 'string') {
    songId = song;
  } else if (song && typeof song === 'object' && song.id) {
    songId = song.id;
  } else {
    console.error('无法获取有效的 songId:', song);
    return;
  }

  const isLocalSong = song.source === 'local';

  try {
    if (isLocalSong) {
      // 本地歌曲处理
      songUrl.value = song.url || '';

      if (song.lyricPath) {
        try {
          const res = await fetch(song.lyricPath);
          if (res.ok) {
            rawLyrics.value = await res.text();
          } else {
            rawLyrics.value = '';
            console.warn(`无法加载歌词文件: ${song.lyricPath}`);
          }
        } catch (error) {
          rawLyrics.value = '';
          console.error(`fetch歌词异常: ${error}`);
        }
      } else {
        rawLyrics.value = '';
      }
    } else {
      // 网络歌曲处理
      const urlRes = await getSongUrl(songId);
      console.log('urlRes:', urlRes);

      let urlData = null;
      try {
        let rawData = urlRes.data;

        if (typeof rawData === 'string') {
          // 如果是字符串，尝试提取第一个 JSON 对象
          const jsonStrMatch = rawData.match(/\{.*?\}/s);
          if (jsonStrMatch) {
            const jsonStr = jsonStrMatch[0];
            const parsed = JSON.parse(jsonStr);

            if (parsed.code !== 200) {
              console.warn('获取歌曲 URL 失败:', parsed.msg);
              songUrl.value = '';
              return;
            }
            urlData = parsed.data;
          } else {
            console.warn('无法正确解析歌曲URL返回的数据');
            songUrl.value = '';
            return;
          }
        } else if (typeof rawData === 'object') {
          urlData = rawData.data;
        } else {
          console.warn('未知格式的歌曲 URL 数据');
          songUrl.value = '';
          return;
        }
      } catch (err) {
        console.error('解析歌曲 URL 响应失败:', err);
        songUrl.value = '';
        return;
      }

      console.log('songId:', songId, 'urlData:', urlData);

      if (!Array.isArray(urlData) || !urlData[0]?.url) {
        console.warn('无有效播放地址');
        songUrl.value = '';
        return;
      }
      songUrl.value = urlData[0].url;

      // 获取歌曲详情
      const detailRes = await getSongDetail(songId);
      const songDetail = detailRes?.data?.songs?.[0];
      if (songDetail && song && typeof song === 'object') {
        song.cover = songDetail.al.picUrl;
        song.artist = songDetail.ar.map(ar => ar.name).join(', ');
      }

      // 获取歌词
      const lyricRes = await getLyric(songId);
      rawLyrics.value = lyricRes.data.lrc?.lyric || '';
      playerStore.setParsedLyrics(parseLyrics(rawLyrics.value));
    }

    // 解析歌词缓存
    if (rawLyrics.value.trim()) {
      const parsedLyrics = parseLyrics(rawLyrics.value);
      playerStore.setParsedLyrics(parsedLyrics);
    } else {
      playerStore.setParsedLyrics([]);
    }
  } catch (error) {
    songUrl.value = '';
    rawLyrics.value = '';
    playerStore.setParsedLyrics([]);
    console.error('加载歌曲失败:', error);
  }
}







function goBack() {
  router.back()
}

function onTimeUpdate() {
  if (!audio.value) return
  playerStore.setCurrentTime(audio.value.currentTime)
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
  val ? audio.value.play() : audio.value.pause()
})

onMounted(() => {
  loadSong()
  window.dispatchEvent(new CustomEvent('hidePlayerBar'))
})
</script>

<style scoped>
.song-detail {
  max-width: 600px;
  margin: auto;
  padding: 1.5rem;
  background: linear-gradient(to bottom, #f5f7fa, #c3cfe2);
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  left: 1rem;
  top: 1rem;
  background: #fff;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}
.back-btn:hover {
  background-color: #e2e8f0;
}

.cover-wrapper {
  width: 280px;
  height: 280px;
  margin: 2rem auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
  cursor: pointer;
}
.cover-wrapper.rotating {
  animation: spin 10s linear infinite;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  margin-top: 1rem;
}
.song-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2rem;
}
.artist-name {
  font-size: 1.1rem;
  color: #666;
}

.lyrics-wrapper {
  max-height: 350px;
  overflow-y: auto;
  padding: 1rem;
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: max-height 0.3s;
}

.audio-player {
  width: 100%;
  margin-top: 1.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
