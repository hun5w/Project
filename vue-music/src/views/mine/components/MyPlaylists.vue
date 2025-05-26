<template>
  <div>
    <h2>我的歌单</h2>

    <div v-if="playlists.length === 0">你还没有创建任何歌单，快去创建一个吧！</div>

    <ul>
      <li v-for="playlist in playlists" :key="playlist.id">
        {{ playlist.name }}
      </li>
    </ul>

    <button @click="showCreate = true">新建歌单</button>

    <div v-if="showCreate" class="create-dialog">
      <input v-model="newPlaylistName" placeholder="请输入歌单名称" />
      <button @click="createPlaylist">确定</button>
      <button @click="showCreate = false">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'user_playlists'

// 1. 先从 localStorage 读取
const playlists = ref([])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      playlists.value = JSON.parse(saved)
    } catch (e) {
      console.error('读取歌单数据失败', e)
    }
  }
})

const showCreate = ref(false)
const newPlaylistName = ref('')

// 2. 监听 playlists 变化，同步存储到 localStorage
watch(playlists, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

function createPlaylist() {
  if (!newPlaylistName.value.trim()) {
    alert('歌单名称不能为空')
    return
  }

  const newId = playlists.value.length
    ? Math.max(...playlists.value.map(p => p.id)) + 1
    : 1

  playlists.value.push({ id: newId, name: newPlaylistName.value.trim() })

  newPlaylistName.value = ''
  showCreate.value = false
}
</script>


<style scoped>
/* 页面整体容器 */
div {
  max-width: 480px;
  margin: 30px auto;
  padding: 20px;
  background: #fff5f5;
  box-shadow: 0 4px 10px rgb(200 12 12 / 0.15);
  border-radius: 10px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
}

/* 标题 */
h2 {
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  color: #C20C0C;
}

/* 提示文字 */
div[v-if] {
  text-align: center;
  color: #aa4444;
  font-style: italic;
  margin-bottom: 15px;
}

/* 歌单列表 */
ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  max-height: 320px;
  overflow-y: auto;
  border-top: 1px solid #f1c0c0;
  border-bottom: 1px solid #f1c0c0;
}

/* 每条歌单 */
li {
  padding: 12px 16px;
  border-bottom: 1px solid #f1c0c0;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

li:hover {
  background-color: #f8d7d7;
  color: #C20C0C;
}

/* 新建歌单按钮 */
button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  background-color: #C20C0C;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

button:hover {
  background-color: #9a0a0a;
}

/* 新建歌单输入框和按钮容器 */
.create-dialog {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 输入框 */
.create-dialog input {
  flex-grow: 1;
  padding: 10px 15px;
  font-size: 1rem;
  border: 1.5px solid #f1c0c0;
  border-radius: 25px;
  outline-offset: 2px;
  transition: border-color 0.3s;
}

.create-dialog input:focus {
  border-color: #C20C0C;
}

/* 创建/取消按钮 */
.create-dialog button {
  padding: 8px 16px;
  font-size: 0.95rem;
  border-radius: 20px;
}

.create-dialog button:first-child {
  background-color: #E73535;
  color: white;
}

.create-dialog button:first-child:hover {
  background-color: #B82B2B;
}

.create-dialog button:last-child {
  background-color: #f44336;
  color: white;
}

.create-dialog button:last-child:hover {
  background-color: #bb2d27;
}
</style>

