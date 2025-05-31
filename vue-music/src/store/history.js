import { defineStore } from 'pinia'

let cachedUsername = null
function getCurrentUsername() {
  if (cachedUsername) return cachedUsername
  cachedUsername = localStorage.getItem('current_user') || 'guest'
  return cachedUsername
}

function getHistoryKey() {
  return `play_history_${getCurrentUsername()}`
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    songs: []
  }),

  actions: {
    addSong(song) {
      const key = getHistoryKey()
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const updated = existing.filter(item => item.id !== song.id)
      updated.unshift(song)
      if (updated.length > 50) updated.pop()
      localStorage.setItem(key, JSON.stringify(updated))
      this.songs = updated
    },

    removeSongById(songId) {
      const key = getHistoryKey()
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const updated = existing.filter(song => song.id !== songId)
      localStorage.setItem(key, JSON.stringify(updated))
      this.songs = updated
    },

    clearHistory() {
      const key = getHistoryKey()
      localStorage.removeItem(key)
      this.songs = []
    },

    refresh() {
      const key = getHistoryKey()
      try {
        const stored = localStorage.getItem(key)
        this.songs = stored ? JSON.parse(stored) : []
      } catch (e) {
        console.error('播放历史数据解析失败', e)
        this.songs = []
      }
    }
  }
})
