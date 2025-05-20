<template>
  <div class="login-container">
    <h2 class="login-title">网易云音乐 - 登录</h2>

    <!-- 登录方式切换 -->
    <div class="login-toggle">
      <span :class="{ active: loginType === 'password' }" @click="loginType = 'password'">密码登录</span>
      <span :class="{ active: loginType === 'code' }" @click="loginType = 'code'">验证码登录</span>
    </div>

    <van-cell-group inset>
      <van-field
        v-model="phone"
        label="手机号"
        placeholder="请输入手机号"
        clearable
      />
      <van-field
        v-if="loginType === 'password'"
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        clearable
      />
      <van-field
        v-if="loginType === 'code'"
        v-model="code"
        label="验证码"
        placeholder="请输入验证码"
        clearable
      >
        <template #button>
          <van-button size="small" type="primary" @click="sendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
          </van-button>
        </template>
      </van-field>
    </van-cell-group>

    <van-button type="primary" block class="login-button" @click="handleLogin">
      登录
    </van-button>

    <div class="login-footer">
      <span @click="goRegister">注册账号</span>
      <span @click="forgotPassword">忘记密码？</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { loginWithPassword, sendCaptcha, verifyCaptcha } from '@/api/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginType = ref('password'); // 'password' 或 'code'
const phone = ref('');
const password = ref('');
const code = ref('');
const countdown = ref(0);
let timer = null;

// 切换登录方式
function switchLogin(type) {
  loginType.value = type;
}

// 发送验证码
async function handleSendCode() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入有效的手机号');
    return;
  }
  try {
    const res = await sendCaptcha(phone.value);
    if (res.code === 200) {
      showToast('验证码已发送');
      startCountdown();
    } else {
      showToast(res.msg || '发送失败');
    }
  } catch (err) {
    console.error(err);
    showToast('网络错误');
  }
}

// 倒计时逻辑
function startCountdown() {
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
}

// 登录操作
async function handleLogin() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入有效的手机号');
    return;
  }

  try {
    let res;
    if (loginType.value === 'password') {
      if (!password.value) {
        showToast('请输入密码');
        return;
      }
      res = await loginWithPassword(phone.value, password.value);
    } else {
      if (!code.value) {
        showToast('请输入验证码');
        return;
      }
      res = await verifyCaptcha(phone.value, code.value);
    }

    if (res.code === 200) {
      showToast('登录成功');
      localStorage.setItem('userInfo', JSON.stringify(res.profile || {}));
      router.push('/profile'); // 登录成功跳转页面
    } else {
      showToast(res.msg || '登录失败');
    }
  } catch (err) {
    console.error('登录失败:', err);
    showToast('请求失败');
  }
}
</script>


<style scoped>
.login-container {
  padding: 30px 20px;
}
.login-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: bold;
}
.login-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.login-toggle span {
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
  color: #888;
}
.login-toggle .active {
  color: #1989fa;
  font-weight: bold;
  border-bottom: 2px solid #1989fa;
}
.login-button {
  margin: 20px 0;
}
.login-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
  padding: 0 4px;
}
.login-footer span {
  cursor: pointer;
}
</style>
