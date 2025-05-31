<template>
  <div class="playlist-page">
    <div class="header">
      <button class="back-btn" @click="goBack">←</button>
      <h2>我的歌单</h2>
    </div>

    <div v-if="playlists.length === 0" class="empty">你还没有创建任何歌单，快去创建一个吧！</div>

    <ul>
      <li v-for="p in playlists" :key="p.id">
        <span @click="goToPlaylistDetail(p)" class="playlist-name">{{ p.name }}</span>
        <button
          class="delete-btn"
          @click.stop="deletePlaylist(p.id)"
          v-if="p.isMine !== false"
        >删除</button>
      </li>
    </ul>

    <button class="create-btn" @click="showCreate = true">新建歌单</button>

    <div v-if="showCreate" class="create-dialog">
      <input v-model="newPlaylistName" placeholder="请输入歌单名称" />
      <button @click="createPlaylist">确定</button>
      <button @click="showCreate = false">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const STORAGE_KEY = 'user_playlists'

const playlists = ref([])
const showCreate = ref(false)
const newPlaylistName = ref('')

// 🧩 默认歌单：所有用户可见，不能删除
const defaultPlaylist = {
  id: 0,
  name: '精选推荐',
  isMine: false,
  songs: [
    { id: 1001, name: '红玫瑰', artists: ['陈奕迅'] },
    { id: 1002, name: '演员', artists: ['薛之谦'] },
    { id: 1003, name: '光年之外', artists: ['邓紫棋'] }
  ]
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  let userPlaylists = []
  if (saved) {
    try {
      userPlaylists = JSON.parse(saved)
    } catch (e) {
      console.error('读取歌单数据失败', e)
    }
  }

  // 确保默认歌单始终存在且放在第一位
  playlists.value = [defaultPlaylist, ...userPlaylists.filter(p => p.id !== 0)]
})

watch(playlists, (newVal) => {
  // 同步非默认歌单到本地
  const toSave = newVal.filter(p => p.id !== 0)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
}, { deep: true })

function createPlaylist() {
  if (!newPlaylistName.value.trim()) {
    alert('歌单名称不能为空')
    return
  }

  const newId = Date.now()
  playlists.value.push({
    id: newId,
    name: newPlaylistName.value.trim(),
    isMine: true,
    songs: []
  })

  newPlaylistName.value = ''
  showCreate.value = false
}

function deletePlaylist(id) {
  if (id === 0) return // 防止删除默认歌单

  const confirmed = confirm('确定要删除这个歌单吗？')
  if (confirmed) {
    playlists.value = playlists.value.filter(p => p.id !== id)
  }
}

function goToPlaylistDetail(p) {
  router.push({ name: 'MySongs', params: { playlistId: p.id } })
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.playlist-page {
  max-width: 420px;
  margin: 16px auto;
  padding: 16px;
  background: #fff5f5;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgb(200 12 12 / 0.15);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.back-btn {
  font-size: 20px;
  background: none;
  border: none;
  color: #c20c0c;
  margin-right: 10px;
  cursor: pointer;
}

h2 {
  flex: 1;
  text-align: center;
  font-size: 1.3rem;
  color: #c20c0c;
}

.empty {
  text-align: center;
  font-style: italic;
  color: #bb4444;
  margin: 15px 0;
}

ul {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
  border-top: 1px solid #f1c0c0;
  border-bottom: 1px solid #f1c0c0;
  max-height: 60vh;
  overflow-y: auto;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 6px;
  border-bottom: 1px solid #f1c0c0;
  font-size: 0.95rem;
}

.playlist-name {
  flex: 1;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-btn {
  background: none;
  color: #d00;
  border: 1px solid #f1bcbc;
  padding: 4px 10px;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
}

.create-btn {
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  background-color: #c20c0c;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}

.create-dialog {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.create-dialog input,
.create-dialog button {
  width: 100%;
  font-size: 0.95rem;
  padding: 10px 12px;
  box-sizing: border-box;
  border-radius: 20px;
}

.create-dialog input {
  border: 1.5px solid #f1c0c0;
}

.create-dialog button:first-child {
  background-color: #e73535;
  color: white;
  border: none;
}

.create-dialog button:last-child {
  background-color: #bbb;
  color: white;
  border: none;
}
</style>
