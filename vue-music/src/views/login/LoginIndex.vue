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

<script>
export default {
  name: "Login",
  data() {
    return {
      loginType: "password", // password | code
      phone: "",
      password: "",
      code: "",
      countdown: 0,
      timer: null,
    };
  },
  methods: {
    handleLogin() {
      if (!this.phone) return this.$toast("请输入手机号");

      if (this.loginType === "password" && !this.password) {
        return this.$toast("请输入密码");
      }
      if (this.loginType === "code" && !this.code) {
        return this.$toast("请输入验证码");
      }

      // TODO: 替换为你的登录请求
      const payload = {
        phone: this.phone,
        ...(this.loginType === "password"
          ? { password: this.password }
          : { code: this.code }),
      };

      console.log("登录信息：", payload);
      this.$toast("模拟登录成功");
    },
    sendCode() {
      if (!this.phone) return this.$toast("请输入手机号");

      // TODO: 调用发送验证码的 API
      this.$toast("验证码已发送");

      // 模拟倒计时
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown <= 1) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.countdown--;
      }, 1000);
    },
    goRegister() {
      this.$toast("跳转注册页");
    },
    forgotPassword() {
      this.$toast("请尝试使用验证码登录");
    },
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
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
