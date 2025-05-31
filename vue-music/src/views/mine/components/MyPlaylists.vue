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

  // ✅ 获取当前用户信息
  const currentUser = JSON.parse(localStorage.getItem('current_user'))
  const userId = currentUser?.id

  // ✅ 筛选当前用户的歌单（排除不是自己的）
  const myPlaylists = allPlaylists.filter(p => p.userId === userId)

  // ✅ 显示默认歌单 + 自己的歌单
  playlists.value = [defaultPlaylist, ...myPlaylists]
})


watch(playlists, (newVal) => {
  const currentUser = JSON.parse(localStorage.getItem('current_user'))
  const userId = currentUser?.id

  // ✅ 获取所有本地歌单
  const saved = localStorage.getItem(STORAGE_KEY)
  let allPlaylists = []
  if (saved) {
    try {
      allPlaylists = JSON.parse(saved)
    } catch (e) {
      console.error('读取歌单数据失败', e)
    }
  }

  // ✅ 删除当前用户旧的歌单（不包括默认）
  const otherUsersPlaylists = allPlaylists.filter(p => p.userId !== userId)

  // ✅ 添加当前用户最新的歌单
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
    userId, // ✅ 添加用户 ID
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
  width: 100vw;
  min-height: 100vh;
  background: #fff5f5;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  padding-bottom: 20px;
}

/* 顶部标题栏 */
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

/* 空状态 */
.empty {
  text-align: center;
  font-style: italic;
  color: #bb4444;
  margin: 15px 0;
}

/* 歌单列表 */
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
  font-size: 15px; /* ✅ 歌单名称字体更适配 */
  font-weight: 500;
}

.playlist-name {
  flex: 1;
  cursor: pointer;
  transition: color 0.2s;
}

/* 删除按钮 */
.delete-btn {
  background: none;
  color: #d00;
  border: 1px solid #f1bcbc;
  padding: 4px 10px;
  font-size: 13px; /* ✅ 更适配的按钮字体 */
  border-radius: 6px;
  cursor: pointer;
}

/* 创建歌单按钮 */
.create-btn {
  width: calc(100% - 32px);
  margin: 0 auto 16px;
  display: block;
  padding: 10px 0;
  font-size: 15px; /* ✅ 更统一的按钮字体 */
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

/* 创建对话框样式 */
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
  font-size: 14px; /* ✅ 输入与确认按钮更适配的字体 */
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

/* 移动端优化 */
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


