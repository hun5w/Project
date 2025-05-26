import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    songs: JSON.parse(localStorage.getItem('play_history') || '[]'),
  }),
  actions: {
    addSong(song) {
      // 去重，最近播放的放前面
      this.songs = this.songs.filter(item => item.id !== song.id)
      this.songs.unshift(song)
      if (this.songs.length > 50) this.songs.pop()

      localStorage.setItem('play_history', JSON.stringify(this.songs))
    },
    clearHistory() {
      this.songs = []
      localStorage.removeItem('play_history')
    }
  }
})
