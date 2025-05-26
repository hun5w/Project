<template>
  <div class="recover-container">
    <h2>找回密码</h2>

    <input
      v-model="username"
      placeholder="请输入用户名"
      class="input-field"
    />
    <input
      v-model="phone"
      placeholder="请输入手机号"
      class="input-field"
    />

    <van-button
      type="primary"
      block
      round
      class="mt"
      @click="handleCheck"
      :disabled="!username || !phone"
    >
      验证信息
    </van-button>

    <template v-if="canReset">
      <input
        v-model="newPassword"
        placeholder="请输入新密码"
        type="password"
        class="input-field"
      />
      <van-button
        type="success"
        block
        round
        class="mt"
        @click="handleReset"
        :disabled="!newPassword || newPassword.length < 6"
      >
        重置密码
      </van-button>
    </template>

    <p class="switch-text">
      已记起密码？
      <span class="link" @click="goToLogin">点我登录</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

const username = ref('')
const phone = ref('')
const newPassword = ref('')
const canReset = ref(false)
const router = useRouter()

const handleCheck = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const match = users.find(
    u => u.username === username.value.trim() && u.phone === phone.value.trim()
  )

  if (!match) {
    showToast('用户名与手机号不匹配')
    canReset.value = false
  } else {
    showToast('验证成功，请设置新密码')
    canReset.value = true
  }
}

const handleReset = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const index = users.findIndex(
    u => u.username === username.value.trim() && u.phone === phone.value.trim()
  )

  if (index === -1) {
    showToast('重置失败，用户不存在')
    return
  }

  users[index].password = newPassword.value.trim()
  localStorage.setItem('users', JSON.stringify(users))
  alert('密码已重置，请使用新密码登录')
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.recover-container {
  max-width: 360px;
  margin: 60px auto;
  padding: 30px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #333;
}

h2 {
  font-size: 26px;
  margin-bottom: 24px;
  color: #c20c0c;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 16px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #c20c0c;
  box-shadow: 0 0 6px #f33a3a66;
}

.mt {
  margin-top: 8px;
}

.switch-text {
  margin-top: 22px;
  font-size: 14px;
  color: #666;
}

.link {
  color: #c20c0c;
  font-weight: 600;
  cursor: pointer;
}
</style>
