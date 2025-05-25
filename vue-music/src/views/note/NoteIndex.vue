<template>
  <div class="discover-page">
    <h2>📌 我的动态</h2>
    <div class="post-box">
      <textarea v-model="newPost" placeholder="分享你的音乐心情..." />
      <button @click="submitPost">发布</button>
    </div>

    <div v-if="localPosts.length === 0" class="no-post">暂无动态</div>
    <div v-for="item in localPosts" :key="item.id" class="event-item local">
      <p class="content">{{ item.content }}</p>
      <p class="time">{{ item.time }}</p>
      <!-- 可以在这里添加编辑和删除按钮 -->
      <button @click="editPost(item)">编辑</button>
      <button @click="deletePost(item.id)">删除</button>
    </div>

    
    <!-- 编辑框弹出部分，简单实现 -->
    <div v-if="editingPost" class="edit-modal">
      <textarea v-model="editingContent"></textarea>
      <button @click="saveEdit">保存</button>
      <button @click="cancelEdit">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLocalNotes } from '@/data/localNotes' 

const newPost = ref('')
const localPosts = ref([])

const editingPost = ref(null)   // 当前编辑的post对象
const editingContent = ref('')

function refresh() {
  getLocalNotes().then(local => {
    localPosts.value = local || []
  })
}


function submitPost() {
  if (!newPost.value.trim()) return alert('请输入内容')
  const posts = JSON.parse(localStorage.getItem('myEvents') || '[]')
  const post = {
    id: Date.now(),
    content: newPost.value,
    time: new Date().toLocaleString()
  }
  posts.unshift(post)
  localStorage.setItem('myEvents', JSON.stringify(posts))
  newPost.value = ''
  refresh()
}

// 编辑
function editPost(post) {
  editingPost.value = post
  editingContent.value = post.content
}

// 保存编辑
function saveEdit() {
  if (!editingContent.value.trim()) return alert('请输入内容')
  const posts = JSON.parse(localStorage.getItem('myEvents') || '[]')
  const index = posts.findIndex(p => p.id === editingPost.value.id)
  if (index !== -1) {
    posts[index].content = editingContent.value
    posts[index].time = new Date().toLocaleString()
    localStorage.setItem('myEvents', JSON.stringify(posts))
    refresh()
  }
  editingPost.value = null
  editingContent.value = ''
}

// 取消编辑
function cancelEdit() {
  editingPost.value = null
  editingContent.value = ''
}

// 删除
function deletePost(id) {
  if (!confirm('确定删除这条动态吗？')) return
  const posts = JSON.parse(localStorage.getItem('myEvents') || '[]')
  const newPosts = posts.filter(p => p.id !== id)
  localStorage.setItem('myEvents', JSON.stringify(newPosts))
  refresh()
}



onMounted(() => {
  refresh()
})
</script>

<style scoped>
.discover-page {
  padding: 16px;
  font-family: sans-serif;
}
h2 {
  margin-top: 24px;
  font-size: 18px;
  font-weight: bold;
}
.post-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 60px;
  resize: none;
  width: 100%;
}
button {
  margin-top: 8px;
  align-self: flex-end;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #ec4141;
  color: white;
  cursor: pointer;
}
.event-item {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  position: relative;
}
.event-item.local {
  border-left: 4px solid #ff9e3c;
}
.user {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
}
.nickname {
  font-weight: bold;
}
.content {
  margin: 6px 0;
}
.time {
  font-size: 12px;
  color: #999;
}
.loading, .no-post {
  color: #888;
  font-size: 14px;
  margin: 12px 0;
}

/* 编辑弹窗简单样式 */
.edit-modal {
  position: fixed;
  top: 30%;
  left: 50%;
  width: 300px;
  padding: 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
}
.edit-modal textarea {
  width: 100%;
  min-height: 80px;
  margin-bottom: 12px;
}
.edit-modal button {
  margin-right: 8px;
}
</style>
