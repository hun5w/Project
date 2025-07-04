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
    <div class="info-cards">
      <div class="info-card">
        <div class="number">{{ listenSongsCount || 0 }}</div>
        <div class="label">听歌总数</div>
      </div>
      <div class="info-card">
        <div class="number">{{ user?.playlistCount || 0 }}</div>
        <div class="label">创建歌单</div>
      </div>
      
    </div>

    <div class="menu-cards">
      <div class="menu-card" @click="goToMyPlaylists">我的歌单</div>
      <div class="menu-card" @click="goToHistory">播放历史</div>
      <div class="menu-card" @click="goToUserInfo">个人信息</div>
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

    <van-button
      v-else
      type="default"
      block
      class="logout-button"
      @click="logout"
    >
      退出登录
    </van-button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getUserProfile, logoutUser } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/store/history'

const router = useRouter()

const user = ref(getUserProfile())

const historyStore = useHistoryStore()

const isGuest = computed(() => {
  const id = localStorage.getItem('current_user_id')
  return id?.startsWith('guest_')
})

// 听歌总数计算
const listenSongsCount = computed(() => {
  const historyList = Array.isArray(historyStore.songs) ? historyStore.songs : []
  const uniqueHistoryCount = new Set(historyList.map(song => song.id)).size
  return (user.value?.listenSongs || 0) + uniqueHistoryCount
})

// 判断后跳转
const goToMyPlaylists = () => {
  if (isGuest.value) {
    alert('游客无法访问“我的歌单”，请先注册或登录')
    return
  }
  router.push('/my-playlists')
}

const goToHistory = () => router.push('/history')

const goToUserInfo = () => {
  if (isGuest.value) {
    alert('游客无法访问“个人信息”，请先注册或登录')
    return
  }
  router.push('/info')
}

const logout = () => {
  logoutUser()
  localStorage.removeItem('current_user')
  user.value = null
  historyStore.refresh()
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}

// 页面加载或返回可见时刷新信息
onMounted(() => {
  historyStore.refresh()

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      refreshProfile()
      historyStore.refresh()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
})

function refreshProfile() {
  user.value = getUserProfile()
}

watch(user, () => {
  historyStore.refresh()
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

.logout-button {
  background-color: #c20c0c;
  border-radius: 30px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 0;
  margin-top: 10px;
  color: #fff;
}
</style>
