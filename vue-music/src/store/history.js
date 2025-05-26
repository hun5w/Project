import { defineStore } from 'pinia'

// 模拟从用户系统中获取当前用户名（你也可以从 store / localStorage 中获取）
function getCurrentUsername() {
  return localStorage.getItem('current_user') || 'guest'
}

function getHistoryKey() {
  return `play_history_${getCurrentUsername()}`
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    songs: JSON.parse(localStorage.getItem(getHistoryKey()) || '[]')
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

    clearHistory() {
      const key = getHistoryKey()
      this.songs = []
      localStorage.removeItem(key)
    },

    refresh() {
      const key = getHistoryKey()
      this.songs = JSON.parse(localStorage.getItem(key) || '[]')
    }
  }
})
