<template>
  <div class="discover-page">
    <h2>📌 我的动态</h2>
    <div class="post-box">
      <textarea v-model="newPost" placeholder="分享你的音乐心情..." />
      <button @click="submitPost" :disabled="editingPost">发布</button>
    </div>

    <div v-if="localPosts.length === 0" class="no-post">暂无动态</div>
    <div v-for="item in localPosts" :key="item.id" class="event-item local">
      <p class="content">{{ item.text }}</p>
      <p class="time">{{ item.time }}</p>
      <button @click="editPost(item)">编辑</button>
      <button @click="deletePost(item.id)">删除</button>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="editingPost" class="edit-modal">
  <div>
    <textarea v-model="editingContent" />
    <button @click="saveEdit">保存</button>
    <button @click="cancelEdit" style="background-color: #aaa;">取消</button>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLocalNotes, saveLocalNote, updateLocalNote, deleteLocalNote } from '@/data/localNotes'

const newPost = ref('')
const localPosts = ref([])
const editingPost = ref(null)
const editingContent = ref('')
const user = ref(null)

function refresh() {
  getLocalNotes().then(local => {
    localPosts.value = (local || []).map(item => ({
      ...item,
      time: item.eventTime
        ? new Date(item.eventTime).toLocaleString('zh-CN', { hour12: false })
        : ''
    }))
  })
}


async function submitPost() {
  if (!newPost.value.trim()) return alert('请输入内容')

  await saveLocalNote(newPost.value.trim()) // ✅ 保证数据写入后再刷新
  newPost.value = ''
  await refresh()
}

function editPost(post) {
  editingPost.value = post
  editingContent.value = post.content
}

async function saveEdit() {
  if (!editingContent.value.trim()) return alert('请输入内容')

  await updateLocalNote(editingPost.value.id, editingContent.value.trim())
  refresh()
  editingPost.value = null
  editingContent.value = ''
}

function cancelEdit() {
  editingPost.value = null
  editingContent.value = ''
}

async function deletePost(id) {
  if (!confirm('确定删除这条动态吗？')) return

  await deleteLocalNote(id)
  refresh()
}

onMounted(() => {
  const raw = localStorage.getItem('current_user')
  if (raw) {
    try {
      user.value = JSON.parse(raw)
    } catch (e) {
      console.warn('Failed to parse current_user:', e)
    }
  }
  refresh()
})
</script>

<style scoped>
.discover-page {
  padding: 16px;
  font-family: sans-serif;
  max-width: 100%;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0;
}

.post-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

textarea {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  resize: none;
}

button {
  padding: 10px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background-color: #ec4141;
  color: white;
  cursor: pointer;
  width: fit-content;
}

.event-item {
  background-color: #fefefe;
  border-left: 4px solid #ff9e3c;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: 15px;
}

.content {
  margin-bottom: 8px;
}

.time {
  font-size: 13px;
  color: #999;
}

.no-post {
  color: #aaa;
  font-size: 14px;
  text-align: center;
  margin: 24px 0;
}

/* 弹窗样式优化 */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.edit-modal > div {
  background: white;
  padding: 16px;
  border-radius: 8px;
  width: 90%;
  max-width: 320px;
}

.edit-modal textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 12px;
  font-size: 15px;
}

</style>
