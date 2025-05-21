<template>
  <div class="user-profile">
    <div class="avatar-wrapper">
      <img
        :src="user?.avatarUrl || defaultAvatar"
        alt="头像"
        class="avatar"
      />
      <span v-if="user?.level" class="level-badge">Lv.{{ user.level }}</span>
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
        <div class="label">歌单数</div>
      </div>
      <div class="info-card">
        <div class="number">{{ user?.fans || 0 }}</div>
        <div class="label">粉丝数</div>
      </div>
      <div class="info-card">
        <div class="number">{{ user?.follows || 0 }}</div>
        <div class="label">关注数</div>
      </div>
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
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/default-avatar.png'
import { getUserProfile } from '@/api/auth'

const router = useRouter()
const user = ref(null)

const isGuest = computed(() => localStorage.getItem('loginType') === 'guest')

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  const profile = getUserProfile()
  if (profile) {
    user.value = profile
  }
})
</script>

<style scoped>
.user-profile {
  max-width: 400px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(194, 12, 12, 0.15);
  text-align: center;
  color: #222;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #c20c0c;
  box-shadow: 0 0 12px rgba(194, 12, 12, 0.4);
}

.level-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #c20c0c;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  user-select: none;
}

.nickname {
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 6px;
}

.signature {
  font-style: italic;
  color: #666;
  font-size: 14px;
  max-width: 280px;
  margin: 0 auto 24px;
  word-wrap: break-word;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background-color: #fef0f0;
  border-radius: 12px;
  padding: 12px 0;
  box-shadow: 0 2px 6px rgba(194, 12, 12, 0.1);
  cursor: default;
  user-select: none;
  transition: box-shadow 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 6px 12px rgba(194, 12, 12, 0.3);
}

.number {
  font-size: 20px;
  font-weight: 700;
  color: #c20c0c;
}

.label {
  margin-top: 6px;
  font-size: 12px;
  color: #c20c0c;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.login-button {
  background-color: #c20c0c;
  border-radius: 24px;
  font-weight: 600;
  font-size: 16px;
}
</style>
