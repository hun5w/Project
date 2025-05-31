import { defineStore } from 'pinia'

function getCurrentUserId() {
  const userJson = localStorage.getItem('current_user')
  if (!userJson) return 'guest'
  try {
    const user = JSON.parse(userJson)
    return user.id || 'guest'
  } catch {
    return 'guest'
  }
}

function getHistoryKey() {
  return `play_history_${getCurrentUserId()}`
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
