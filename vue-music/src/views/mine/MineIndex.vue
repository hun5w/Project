<template>
  <div class="user-profile">
    <div class="avatar-wrapper">
      <img
        :src="user?.avatarUrl || defaultAvatar"
        alt="头像"
        class="avatar"
      />
      <div class="level-vip">
        <span class="level">Lv.{{ user?.level || 0 }}</span>
        <span v-if="user?.vipType > 0" class="vip">VIP</span>
      </div>
    </div>

    <h2 class="nickname">{{ user?.nickname || '未登录用户' }}</h2>
    <p class="signature">{{ user?.signature || '这个人很神秘~' }}</p>

    <div class="info-cards">
      <div class="info-card">
        <div class="number">{{ user?.listenSongs || 0 }}</div>
        <div class="label">听歌总数</div>
      </div>
      <div class="info-card">
        <div class="number">{{ user?.playlistCount || 0 }}</div>
        <div class="label">创建歌单</div>
      </div>
      <div class="info-card">
        <div class="number">{{ user?.follows || 0 }}</div>
        <div class="label">关注</div>
      </div>
      <div class="info-card">
        <div class="number">{{ user?.fans || 0 }}</div>
        <div class="label">粉丝</div>
      </div>
    </div>

    <div class="menu-cards">
      <div class="menu-card">我的动态</div>
      <div class="menu-card">我的收藏</div>
      <div class="menu-card">我的好友</div>
      <div class="menu-card">我的钱包</div>
    </div>

    <van-button
      v-if="isGuest"
      type="primary"
      block
      class="login-button"
      @click="goToLogin"
    >
      重新登录
    </van-button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUserProfile } from '@/api/auth' // 直接使用您的auth.js方法

const user = ref(getUserProfile()) // 初始化时读取本地存储

// 实时计算登录状态
const isGuest = computed(() => !user.value)

// 刷新用户信息
const refreshProfile = async () => {
  try {
    // 这里需要添加一个获取最新资料的方法
    // 或者重新登录获取数据（根据您的业务需求）
    user.value = getUserProfile()
  } catch (error) {
    console.error('刷新用户信息失败:', error)
  }
}

onMounted(() => {
  // 添加 visibilitychange 监听
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      refreshProfile()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
})
</script>

<style scoped>
.user-profile {
  max-width: 420px;
  margin: 40px auto;
  background-color: #fff;
  padding: 30px 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.1);
  text-align: center;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.avatar-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c20c0c, #f33a3a);
  padding: 4px;
  box-sizing: border-box;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
}

.level-vip {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 2px 8px;
  font-weight: 600;
  font-size: 14px;
  color: #c20c0c;
  box-shadow: 0 0 6px #f33a3a;
}

.vip {
  background: linear-gradient(90deg, #f90, #f30);
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 700;
}

.nickname {
  font-weight: 700;
  font-size: 26px;
  margin-bottom: 4px;
  color: #c20c0c;
}

.signature {
  font-style: italic;
  color: #999;
  font-size: 14px;
  margin-bottom: 30px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
}

.info-cards {
  display: flex;
  justify-content: space-around;
  margin-bottom: 36px;
}

.info-card {
  text-align: center;
  cursor: default;
}

.number {
  font-size: 28px;
  font-weight: 700;
  color: #c20c0c;
}

.label {
  font-size: 14px;
  color: #666;
  margin-top: 6px;
  user-select: none;
}

.menu-cards {
  display: flex;
  justify-content: space-around;
  margin-bottom: 32px;
}

.menu-card {
  background: #f6f6f6;
  color: #c20c0c;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 20px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.3s ease;
}

.menu-card:hover {
  background: #f0c0c0;
}

.login-button {
  background-color: #c20c0c;
  border-radius: 30px;
  font-weight: 700;
  font-size: 18px;
  padding: 12px 0;
}
</style>
