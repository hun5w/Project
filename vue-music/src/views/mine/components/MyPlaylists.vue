<template>
  <div class="playlist-page">
    <div class="header">
      <button class="back-btn" @click="goBack">←</button>
      <h2>我的歌单</h2>
    </div>

    <div v-if="playlists.length === 0" class="empty">你还没有创建任何歌单，快去创建一个吧！</div>

    <ul>
      <li v-for="p in playlists" :key="p.id">
        <template v-if="renamingId === p.id">
          <input v-model="renameName" class="rename-input" />
          <button @click="confirmRename(p.id)">保存</button>
          <button @click="cancelRename">取消</button>
        </template>
        <template v-else>
          <span @click="goToPlaylistDetail(p)" class="playlist-name">{{ p.name }}</span>
          <div>
            <button
              class="delete-btn"
              @click.stop="deletePlaylist(p.id)"
              v-if="p.isMine !== false"
            >删除</button>
            <button
              class="delete-btn"
              @click.stop="startRename(p)"
              v-if="p.isMine !== false"
            >重命名</button>
          </div>
        </template>
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

const renamingId = ref(null)
const renameName = ref('')

// 默认歌单（不可删除）
const defaultPlaylist = {
  id: 0,
  name: '精选推荐',
  isMine: false,
  songs: [
    { id: 1001, name: '反方向的钟', artists: ['周杰伦'] },
    { id: 1002, name: '明明就', artists: ['周杰伦'] },
    { id: 1003, name: '七里香', artists: ['周杰伦'] },
    { id: 1004, name: '晴天', artists: ['周杰伦'] },
  ]
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  let allPlaylists = []
  if (saved) {
    try {
      allPlaylists = JSON.parse(saved)
    } catch (e) {
      console.error('读取歌单数据失败', e)
    }
  }

  const currentUser = JSON.parse(localStorage.getItem('current_user'))
  const userId = currentUser?.id
  const myPlaylists = allPlaylists.filter(p => p.userId === userId)
  playlists.value = [defaultPlaylist, ...myPlaylists]
})

watch(playlists, (newVal) => {
  const currentUser = JSON.parse(localStorage.getItem('current_user'))
  const userId = currentUser?.id

  const saved = localStorage.getItem(STORAGE_KEY)
  let allPlaylists = []
  if (saved) {
    try {
      allPlaylists = JSON.parse(saved)
    } catch (e) {
      console.error('读取歌单数据失败', e)
    }
  }

  const otherUsersPlaylists = allPlaylists.filter(p => p.userId !== userId)
  const myPlaylistsToSave = newVal.filter(p => p.id !== 0 && p.userId === userId)

  const final = [...otherUsersPlaylists, ...myPlaylistsToSave]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(final))
}, { deep: true })

function createPlaylist() {
  if (!newPlaylistName.value.trim()) {
    alert('歌单名称不能为空')
    return
  }

  const nameExists = playlists.value.some(p => p.name === newPlaylistName.value.trim())
  if (nameExists) {
    alert('已有同名歌单')
    return
  }

  const currentUser = JSON.parse(localStorage.getItem('current_user'))
  const userId = currentUser?.id

  const newId = Date.now()
  playlists.value.push({
    id: newId,
    name: newPlaylistName.value.trim(),
    isMine: true,
    userId,
    songs: []
  })

  newPlaylistName.value = ''
  showCreate.value = false
}

function deletePlaylist(id) {
  if (id === 0) return
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

// 重命名逻辑
function startRename(p) {
  renamingId.value = p.id
  renameName.value = p.name
}

function cancelRename() {
  renamingId.value = null
  renameName.value = ''
}

function confirmRename(id) {
  const name = renameName.value.trim()
  if (!name) {
    alert('歌单名称不能为空')
    return
  }
  const nameExists = playlists.value.some(p => p.name === name && p.id !== id)
  if (nameExists) {
    alert('已有同名歌单')
    return
  }

  const target = playlists.value.find(p => p.id === id)
  if (target) {
    target.name = name
  }

  cancelRename()
}
</script>

<style scoped>
.playlist-page {
  width: 100vw;
  min-height: 100vh;
  background: #fff5f5;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  padding-bottom: 20px;
}

.header {
  position: sticky;
  top: 0;
  background-color: #fff5f5;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1c0c0;
}

.back-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #C20C0C;
  margin-right: 10px;
  cursor: pointer;
}

h2 {
  font-size: 18px;
  color: #C20C0C;
  font-weight: bold;
}

.empty {
  text-align: center;
  font-style: italic;
  color: #bb4444;
  margin: 15px 0;
}

ul {
  list-style: none;
  padding: 0 16px;
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
  padding: 12px 0;
  border-bottom: 1px solid #f1c0c0;
  font-size: 15px;
  font-weight: 500;
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
  font-size: 13px;
  border-radius: 6px;
  margin-left: 8px;
  cursor: pointer;
}

.create-btn {
  width: calc(100% - 32px);
  margin: 0 auto 16px;
  display: block;
  padding: 10px 0;
  font-size: 15px;
  font-weight: bold;
  background-color: #c20c0c;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}
.create-btn:hover {
  background-color: #b00c0c;
}

.create-dialog {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 16px;
}

.create-dialog input,
.create-dialog button {
  width: 100%;
  font-size: 14px;
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

.rename-input {
  flex: 1;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #f1c0c0;
  border-radius: 6px;
  margin-right: 8px;
}

@media (max-width: 480px) {
  h2 {
    font-size: 16px;
  }
  li {
    font-size: 14px;
  }
  .delete-btn {
    font-size: 12px;
    padding: 3px 8px;
  }
  .create-btn {
    font-size: 14px;
  }
  .create-dialog input,
  .create-dialog button {
    font-size: 13px;
  }
}
</style>
