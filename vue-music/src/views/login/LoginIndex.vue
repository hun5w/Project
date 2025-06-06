<template>
  <div class="login-container">
    <h2>账号登录</h2>

    <input
      v-model.trim="username"
      placeholder="请输入用户名"
      autocomplete="username"
      maxlength="20"
      class="input-field"
      :disabled="loading"
      @blur="validateUsername"
    />
    <div v-if="usernameError" class="error-msg">{{ usernameError }}</div>

    <input
      v-model.trim="password"
      type="password"
      placeholder="请输入密码"
      autocomplete="current-password"
      maxlength="20"
      class="input-field"
      :disabled="loading"
      @blur="validatePassword"
    />
    <div v-if="passwordError" class="error-msg">{{ passwordError }}</div>

    <van-button
      type="primary"
      block
      round
      @click="handleLogin"
      :disabled="loading || !username || !password"
      :loading="loading"
    >
      登录
    </van-button>

    <van-button
      type="default"
      block
      round
      class="guest-btn"
      @click="handleGuestLogin"
      :disabled="loading"
    >
      游客登录
    </van-button>

    <div v-if="loginError" class="error-msg login-error">{{ loginError }}</div>

    <p class="switch-text">
      还没有账号？
      <span class="link" @click="goToRegister">点我注册</span>
    </p>
    <p class="switch-text">
  忘记密码？<span class="link" @click="goToRecover">点我找回</span>
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginUser } from '@/api/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')
const loginError = ref('')
const loading = ref(false)

const router = useRouter()

// 校验用户名是否为空
const validateUsername = () => {
  usernameError.value = username.value ? '' : '请输入用户名'
}

// 校验密码是否为空
const validatePassword = () => {
  passwordError.value = password.value ? '' : '请输入密码'
}

// 总体校验逻辑
const validateInputs = () => {
  validateUsername()
  validatePassword()
  return !usernameError.value && !passwordError.value
}
// 游客登录逻辑
const handleGuestLogin = () => {
  const guestUser = {
    id: 'guest_' + Date.now(),
    username: '游客用户'
  }
  localStorage.setItem('current_user_id', guestUser.id)
  localStorage.setItem('guest_user', JSON.stringify(guestUser))
  alert('以游客身份登录，欢迎体验！')
  router.push('/mine')
}

// 登录主逻辑
const handleLogin = async () => {
  loginError.value = ''
  if (!validateInputs()) return

  loading.value = true
  try {
    const user =await loginUser({
      username: username.value,
      password: password.value
    })
    localStorage.setItem('current_user_id', user.id)

    console.log('登录成功，用户id:', user.id)
    console.log('localStorage current_user_id:', localStorage.getItem('current_user_id'))

    alert('登录成功！欢迎回来！')
    
    router.push('/mine')
  } catch (error) {
    loginError.value = error.message || '登录失败，请重试'
    alert('登录失败：' + loginError.value)
  } finally {
    loading.value = false
  }
}

// 跳转注册页面
const goToRegister = () => {
  router.push('/register')
}

// 跳转找回密码页面
const goToRecover = () => {
  router.push('/recover')
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
  margin-bottom: 4px;
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

.error-msg {
  color: #f33a3a;
  font-size: 13px;
  margin-bottom: 12px;
  text-align: left;
  padding-left: 4px;
}

.login-error {
  margin-top: 10px;
  font-weight: 600;
  text-align: center;
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

.guest-btn {
  margin-top: 12px;
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ccc;
}

.guest-btn:hover {
  background-color: #e6e6e6;
}

</style>
