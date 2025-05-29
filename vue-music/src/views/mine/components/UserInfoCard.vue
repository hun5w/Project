<template>
  <div class="user-info-card">

    <!-- 返回键 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" class="back-icon" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
        返回
      </button>
    </div>
    <!-- 头像上传 -->
    <div class="avatar-section">
      <img :src="preview || defaultAvatar" alt="头像" class="avatar-preview" />
      <label for="avatar-upload" class="upload-btn">上传头像</label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        capture="user"
        @change="onFileChange"
        style="display:none"
      />
    </div>

    <!-- 基本信息编辑 -->
    <div class="info-section">
      <label>
        昵称：
        <input v-model="editData.nickname" maxlength="20" placeholder="请输入昵称" />
      </label>

      <label>
        个性签名：
        <textarea v-model="editData.signature" maxlength="50" placeholder="请输入个性签名"></textarea>
      </label>

      <label>
        生日：
        <input type="date" v-model="editData.birthday" />
      </label>

      <label>
        性别：
        <select v-model="editData.gender">
          <option value="">请选择</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
        </select>
      </label>

      <label>
        地区：
        <input v-model="editData.region" maxlength="30" placeholder="请输入地区" />
      </label>

      <label>
        邮箱：
        <input v-model="editData.email" type="email" placeholder="请输入邮箱" />
      </label>

      <!-- 新增学历 -->
      <label>
        学历：
        <select v-model="editData.education">
          <option value="">请选择</option>
          <option value="primary">小学</option>
          <option value="middle">初中</option>
          <option value="high">高中</option>
          <option value="college">大专</option>
          <option value="bachelor">本科</option>
          <option value="master">硕士</option>
          <option value="doctor">博士</option>
        </select>
      </label>

      <!-- 新增喜欢的音乐标签 -->
      <label>
        喜欢的音乐标签：
        <div class="tags-input">
          <input
            v-model="newTag"
            @keyup.enter="addTag"
            placeholder="输入标签，回车添加"
            maxlength="15"
          />
          <button type="button" @click="addTag">添加</button>
        </div>
        <div class="tags-list">
          <span
            class="tag-item"
            v-for="(tag, index) in editData.musicTags"
            :key="index"
          >
            {{ tag }}
            <span class="remove-tag" @click="removeTag(index)">×</span>
          </span>
        </div>
      </label>
    </div>

    <!-- 保存按钮 -->
    <button class="save-btn" @click="saveUserData">保存修改</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const defaultAvatar = '/default-avatar.png'
const user = ref(null)
const preview = ref(defaultAvatar)
const newTag = ref('')

const editData = ref({
  avatarUrl: '',
  nickname: '',
  signature: '',
  birthday: '',
  gender: '',
  region: '',
  email: '',
  education: '',
  musicTags: []
})

function loadUserData() {
  const localUser = localStorage.getItem('current_user')
  if (localUser) {
    try {
      user.value = JSON.parse(localUser)
      preview.value = user.value.avatarUrl || defaultAvatar
      editData.value = {
        avatarUrl: user.value.avatarUrl || '',
        nickname: user.value.nickname || '',
        signature: user.value.signature || '',
        birthday: user.value.birthday || '',
        gender: user.value.gender || '',
        region: user.value.region || '',
        email: user.value.email || '',
        education: user.value.education || '',
        musicTags: user.value.musicTags || []
      }
    } catch (e) {
      console.error('解析用户数据失败:', e)
    }
  }
}

function onFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB')
    return
  }

  preview.value = URL.createObjectURL(file)
  editData.value.avatarUrl = preview.value
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !editData.value.musicTags.includes(tag)) {
    editData.value.musicTags.push(tag)
  }
  newTag.value = ''
}

function removeTag(index) {
  editData.value.musicTags.splice(index, 1)
}

function saveUserData() {
  if (!editData.value.nickname.trim()) {
    alert('昵称不能为空')
    return
  }
  if (editData.value.email && !/^\S+@\S+\.\S+$/.test(editData.value.email)) {
    alert('请输入有效的邮箱地址')
    return
  }

  user.value = {
    ...user.value,
    avatarUrl: editData.value.avatarUrl,
    nickname: editData.value.nickname.trim(),
    signature: editData.value.signature.trim(),
    birthday: editData.value.birthday,
    gender: editData.value.gender,
    region: editData.value.region.trim(),
    email: editData.value.email.trim(),
    education: editData.value.education,
    musicTags: editData.value.musicTags
  }

  localStorage.setItem('current_user', JSON.stringify(user.value))
  alert('保存成功！')
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-info-card {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.1);
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  color: #333;
  text-align: center;
}

/* 返回键部分 */
.header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #c20c0c;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  padding: 0;
}

.back-btn:hover {
  color: #e64343;
}

.back-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  fill: currentColor;
}

.avatar-section {
  margin-bottom: 24px;
  position: relative;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #c20c0c;
  margin-bottom: 12px;
  background-color: #f5f5f5;
}

.upload-btn {
  display: inline-block;
  padding: 10px 24px;
  background-color: #c20c0c;
  color: white;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}
.upload-btn:hover {
  background-color: #e64343;
}

.info-section label {
  display: block;
  text-align: left;
  font-weight: 600;
  margin-bottom: 16px;
  color: #c20c0c;
}

.info-section input,
.info-section textarea,
.info-section select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  margin-top: 6px;
  box-sizing: border-box;
  resize: none;
}

.info-section textarea {
  height: 60px;
}

/* 标签输入与展示 */
.tags-input {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.tags-input input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.tags-input button {
  padding: 8px 16px;
  background-color: #c20c0c;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tags-input button:hover {
  background-color: #e64343;
}

.tags-list {
  margin-top: 8px;
}

.tag-item {
  display: inline-block;
  background-color: #c20c0c;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  user-select: none;
  position: relative;
}

.remove-tag {
  cursor: pointer;
  margin-left: 8px;
  font-weight: bold;
  user-select: none;
  position: absolute;
  top: 0;
  right: 6px;
}

.save-btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px 0;
  background-color: #c20c0c;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}
.save-btn:hover {
  background-color: #e64343;
}
</style>
