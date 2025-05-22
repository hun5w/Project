<template>
  <div class="login-container">
    <h2>账号登录</h2>
    <input
      v-model="username"
      placeholder="请输入用户名"
      autocomplete="username"
      maxlength="20"
      class="input-field"
    />
    <input
      v-model="password"
      type="password"
      placeholder="请输入密码"
      autocomplete="current-password"
      maxlength="20"
      class="input-field"
    />
    <van-button
      type="primary"
      block
      round
      @click="handleLogin"
      :disabled="!username || !password"
    >
      登录
    </van-button>
    <p class="switch-text">
      还没有账号？
      <span class="link" @click="goToRegister">点我注册</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginUser } from '@/api/auth'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  try {
    loginUser({ username: username.value.trim(), password: password.value.trim() })
    showToast('登录成功')
    router.push('/mine')
  } catch (e) {
    showToast(e.message)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  max-width: 360px;
  margin: 60px auto;
  padding: 30px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  color: #333;
}

h2 {
  font-weight: 700;
  font-size: 28px;
  color: #c20c0c;
  margin-bottom: 30px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 18px;
  font-size: 16px;
  border: 1.8px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #c20c0c;
  box-shadow: 0 0 6px #f33a3a66;
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
  user-select: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #f33a3a;
}
</style>
