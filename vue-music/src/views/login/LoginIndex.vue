<template>
  <div class="login-container">
    <van-form @submit="handleLogin">
      <van-cell-group inset>
        <van-field
          v-model="phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          maxlength="11"
          required
        />
        <van-field
          v-model="code"
          label="验证码"
          placeholder="请输入验证码"
          maxlength="6"
          required
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="countdown > 0"
              @click="handleSendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { sendCaptcha, verifyCaptcha } from '@/api/auth'
import { useRouter } from 'vue-router'

const phone = ref('')
const code = ref('')
const countdown = ref(0)
let timer = null

const router = useRouter()

function validatePhone() {
  return /^1[3-9]\d{9}$/.test(phone.value)
}

// 发送验证码
async function handleSendCode() {
  if (!validatePhone()) {
    showToast('请输入有效的手机号')
    return
  }

  try {
    const res = await sendCaptcha(phone.value)
    if (res.code === 200) {
      showToast('验证码已发送')
      startCountdown()
    } else {
      showToast(res.msg || '发送失败')
    }
  } catch (err) {
    console.error(err)
    showToast('发送验证码失败')
  }
}

// 倒计时
function startCountdown() {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 验证码登录
async function handleLogin() {
  if (!validatePhone()) {
    showToast('请输入有效的手机号')
    return
  }

  if (!code.value) {
    showToast('请输入验证码')
    return
  }

  try {
    const res = await verifyCaptcha(phone.value, code.value)
    if (res.code === 200) {
      showToast('登录成功')
      localStorage.setItem('userInfo', JSON.stringify(res))
      router.push('/profile') // 登录成功跳转
    } else {
      showToast(res.msg || '登录失败')
    }
  } catch (err) {
    console.error('登录失败:', err)
    showToast('请求失败')
  }
}
</script>

<style scoped>
.login-container {
  padding: 20px;
}
</style>
