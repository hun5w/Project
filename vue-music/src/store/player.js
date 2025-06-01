import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playlist: [],
    currentIndex: 0,
    playing: false,
    currentTime: 0,
    duration: 0,
    parsedLyrics: [],
  }),
  getters: {
    currentSongId: (state) => state.playlist[state.currentIndex]?.id || null,
  },
  actions: {
  setPlaylist(list) {
    console.log('设置播放列表:', list)
    this.playlist = list
    this.currentTime = 0
    this.duration = 0
  },
  setCurrentIndex(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentIndex = index
      this.currentTime = 0
      this.duration = 0
    }
  },
  setPlaying(flag) {
    this.playing = flag
  },
  togglePlay() {
    this.playing = !this.playing
  },
  setCurrentTime(time) {
    this.currentTime = time
  },
  setDuration(duration) {
    this.duration = duration
  },
  seek(time) {
    this.currentTime = time
  },
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length
    this.currentTime = 0
    this.duration = 0
  },
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length
    this.currentTime = 0
    this.duration = 0
  },
  setParsedLyrics(lyrics) {
      this.parsedLyrics = lyrics || []
    },
}
,
})
