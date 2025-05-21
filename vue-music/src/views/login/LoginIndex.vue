<template>
  <div class="login-container">
    <div class="login-box">
      <h1>扫码登录网易云音乐</h1>

      <div v-if="qrImg" class="qr-code">
        <img :src="qrImg" alt="扫码登录二维码" />
      </div>
      <div v-else>
        正在生成二维码...
      </div>

      <div class="status-text">{{ statusText }}</div>

      <van-button
        v-if="status === 'expired' || status === 'error'"
        type="primary"
        block
        round
        @click="generateQRCode"
      >
        重新生成二维码
      </van-button>

      <van-button
        type="default"
        block
        round
        @click="loginAsGuest"
      >
        游客登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { loginWithQRCode } from '@/api/auth.js'

const router = useRouter()
const apiBaseURL = 'http://localhost:3000'

const qrKey = ref('')
const qrImg = ref('')
const status = ref('loading') // 状态：loading, waitScan, waitConfirm, success, expired, error
const statusText = ref('')

let timer = null

const request = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  timeout: 10000,
})

async function generateQRCode() {
  status.value = 'loading'
  statusText.value = '正在生成二维码...'
  qrImg.value = ''

  try {
    const keyRes = await request.get('/login/qr/key', {
      params: { timestamp: Date.now() }
    })
    qrKey.value = keyRes.data.data.unikey

    const qrRes = await request.get('/login/qr/create', {
      params: { key: qrKey.value, qrimg: true, timestamp: Date.now() }
    })
    qrImg.value = qrRes.data.data.qrimg
    status.value = 'waitScan'
    statusText.value = '请使用网易云音乐 APP 扫描二维码登录'

    startPolling()
  } catch (error) {
    status.value = 'error'
    statusText.value = '二维码生成失败，请稍后重试'
    console.error('二维码生成失败', error)
  }
}

async function checkQRCodeStatus() {
  try {
    const res = await request.get('/login/qr/check', {
      params: { key: qrKey.value, timestamp: Date.now() }
    })
    const code = res.data.code
    switch (code) {
      case 800:
        status.value = 'expired'
        statusText.value = '二维码已过期，请点击重新生成'
        stopPolling()
        break
      case 801:
        status.value = 'waitScan'
        statusText.value = '请使用网易云音乐 APP 扫描二维码登录'
        break
      case 802:
        status.value = 'waitConfirm'
        statusText.value = '扫码成功，请在手机上确认登录'
        break
      case 803:
        status.value = 'success'
        statusText.value = '登录成功，正在跳转...'
        stopPolling()
        saveCookieFromResponse(res)
        await fetchUserProfile()
        setTimeout(() => {
          router.push('/home')
        }, 1000)
        break
    }
  } catch (error) {
    status.value = 'error'
    statusText.value = '登录状态异常，请重新扫码'
    stopPolling()
    console.error('扫码状态异常', error)
  }
}

function startPolling() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    checkQRCodeStatus()
  }, 2000)
}

function stopPolling() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function saveCookieFromResponse() {
  // 简化处理，使用浏览器自动保存 cookie
}

async function fetchUserProfile() {
  try {
    const profile = await loginWithQRCode()
    showToast('登录成功，欢迎 ' + profile.nickname)
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

// 游客登录逻辑
function loginAsGuest() {
  const guestProfile = {
    id: 0,
    nickname: '游客',
    avatarUrl: 'https://img.icons8.com/color/96/guest-male.png',
    signature: '欢迎体验网易云音乐',
    vipType: 0,
    level: 0,
    listenSongs: 0,
    playlistCount: 0,
    follows: 0,
    fans: 0
  }

  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('loginType', 'guest')
  localStorage.setItem('userProfile', JSON.stringify(guestProfile))

  showToast('已以游客身份登录')
  router.push('/home')
}

onMounted(() => {
  generateQRCode()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
}

.login-box {
  width: 100%;
  max-width: 360px;
  padding: 24px;
  border-radius: 12px;
  background: #f7f8fa;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.qr-code img {
  width: 220px;
  height: 220px;
  margin: 20px auto;
}

.status-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}
</style>
