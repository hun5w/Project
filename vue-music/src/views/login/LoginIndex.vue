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

// 本地 API 地址
const apiBaseURL = 'http://localhost:3000'

const qrKey = ref('')
const qrImg = ref('')
const status = ref('loading') // loading, waitScan, waitConfirm, success, expired, error
const statusText = ref('')

let timer = null

// 创建 axios 实例，withCredentials 确保 cookie 支持
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
    // 1. 获取 key
    const keyRes = await request.get('/login/qr/key', {
      params: { timestamp: Date.now() }
    })
    qrKey.value = keyRes.data.data.unikey

    // 2. 获取二维码图片
    const qrRes = await request.get('/login/qr/create', {
      params: { key: qrKey.value, qrimg: true, timestamp: Date.now() }
    })
    qrImg.value = qrRes.data.data.qrimg
    status.value = 'waitScan'
    statusText.value = '请使用网易云音乐 APP 扫描二维码登录'

    // 3. 启动轮询监听扫码状态
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
      case 800: // 二维码过期
        status.value = 'expired'
        statusText.value = '二维码已过期，请点击重新生成'
        stopPolling()
        break
      case 801: // 等待扫码
        status.value = 'waitScan'
        statusText.value = '请使用网易云音乐 APP 扫描二维码登录'
        break
      case 802: // 已扫码，等待确认
        status.value = 'waitConfirm'
        statusText.value = '扫码成功，请在手机上确认登录'
        break
      case 803: // 登录成功
        status.value = 'success'
        statusText.value = '登录成功，正在跳转...'
        stopPolling()

        // 登录成功后，cookie 会被设置，保存 cookie
        saveCookieFromResponse(res)

        // 请求用户详情保存到 localStorage
        await fetchUserProfile()

        // 跳转首页
        setTimeout(() => {
          router.push('/home')
        }, 1000)
        break
      default:
        // 其他状态不处理
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

// 保存服务器返回的 cookie 到浏览器 localStorage
function saveCookieFromResponse() {
  // 真实 cookie 保存在 axios 的 set-cookie 头，浏览器环境下 axios不会直接暴露
  // 这里通过二次请求 /login/status 拿到 cookie（或者在 API 服务器中返回 cookie）
  // 简化方案：请求 /login/status 并取响应头（建议后端改为返回 cookie 字符串）

  // 这里我们直接调用 /login/status 获取登录状态及用户信息
  // cookie 会自动保存到浏览器（前提：withCredentials: true 且 API 跨域配置正确）

  // 暂时啥也不做，登录状态靠浏览器 cookie 保持
}

// 请求用户详情接口，保存用户信息到 localStorage
async function fetchUserProfile() {
  try {
    const profile = await loginWithQRCode()
    showToast('登录成功，欢迎 ' + profile.nickname)
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
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
