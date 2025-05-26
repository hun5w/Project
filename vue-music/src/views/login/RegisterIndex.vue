<template>
  <div class="register-container">
    <h2>注册新账号</h2>

    <input
      v-model="username"
      placeholder="请输入账号"
      maxlength="20"
      class="input-field"
      @blur="validateUsername"
    />
    <div v-if="usernameError" class="error-msg">{{ usernameError }}</div>

    <input
      v-model="nickname"
      placeholder="请输入昵称"
      maxlength="20"
      class="input-field"
      @blur="validateNickname"
    />
    <div v-if="nicknameError" class="error-msg">{{ nicknameError }}</div>

    <input
      v-model="phone"
      placeholder="请输入11位手机号"
      maxlength="11"
      class="input-field"
      @blur="validatePhone"
    />
    <div v-if="phoneError" class="error-msg">{{ phoneError }}</div>

    <input
      v-model="password"
      type="password"
      placeholder="请输入密码"
      maxlength="20"
      class="input-field"
      @blur="validatePassword"
    />
    <div v-if="passwordError" class="error-msg">{{ passwordError }}</div>

    <van-button
      type="primary"
      block
      round
      @click="handleRegister"
      :disabled="!isFormValid || loading"
      :loading="loading"
    >
      注册
    </van-button>

    <p class="switch-text">
      已有账号？
      <span class="link" @click="goToLogin">点我登录</span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/auth'
import { showToast } from 'vant'

const username = ref('')
const password = ref('')
const nickname = ref('')
const phone = ref('')

const usernameError = ref('')
const passwordError = ref('')
const nicknameError = ref('')
const phoneError = ref('')
const loading = ref(false)
const router = useRouter()

const validateUsername = () => {
  usernameError.value = username.value.trim() ? '' : '请输入账号'
}

const validatePassword = () => {
  passwordError.value =
    password.value.length >= 6 ? '' : '密码长度不能少于6位'
}

const validateNickname = () => {
  nicknameError.value = nickname.value.trim() ? '' : '请输入昵称'
}

const validatePhone = () => {
  const pattern = /^1[3-9]\d{9}$/
  phoneError.value = pattern.test(phone.value) ? '' : '手机号格式不正确'
}

const isFormValid = computed(() => {
  return (
    username.value &&
    password.value.length >= 6 &&
    nickname.value &&
    /^1[3-9]\d{9}$/.test(phone.value)
  )
})

const handleRegister = async () => {
  validateUsername()
  validatePassword()
  validateNickname()
  validatePhone()

  if (
    usernameError.value ||
    passwordError.value ||
    nicknameError.value ||
    phoneError.value
  ) {
    return
  }

  loading.value = true
  try {
    await registerUser({
      username: username.value.trim(),
      password: password.value.trim(),
      nickname: nickname.value.trim(),
      phone: phone.value.trim()
    })
    showToast('注册成功！即将跳转登录页')
    router.push('/login')
  } catch (e) {
    showToast('注册失败：' + e.message)
  } finally {
    loading.value = false
  }
}


const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
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
