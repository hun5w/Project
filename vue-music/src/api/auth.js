import request from '@/utils/request'

// 二维码登录获取完整信息
export async function loginWithQRCode() {
  const res = await request.get('/login/status')

  if (res.data.code !== 200 || !res.data.data.profile) {
    throw new Error('登录失败或未获取到用户信息')
  }

  const uid = res.data.data.account.id

  const detailRes = await request.get('/user/detail', { params: { uid } })
  const subcountRes = await request.get('/user/subcount')
  const levelRes = await request.get('/user/level')
  const accountRes = await request.get('/user/account')

  const profile = {
    id: uid,
    nickname: accountRes.data.profile.nickname,
    avatarUrl: accountRes.data.profile.avatarUrl,
    signature: accountRes.data.profile.signature,
    vipType: accountRes.data.profile.vipType,
    level: levelRes.data.data.level || 0,
    listenSongs: levelRes.data.data.listenSongs || 0,
    playlistCount: detailRes.data.playlistCount || 0,
    follows: subcountRes.data.follows || 0,
    fans: subcountRes.data.followeds || 0
  }

  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('loginType', 'qr')
  localStorage.setItem('userProfile', JSON.stringify(profile))

  return profile
}

// 获取本地存储的用户信息
export function getUserProfile() {
  const json = localStorage.getItem('userProfile')
  return json ? JSON.parse(json) : null
}

// 刷新用户资料
export async function refreshUserProfile() {
  try {
    const uid = JSON.parse(localStorage.getItem('userProfile'))?.id
    if (!uid) return null

    const [detailRes, subcountRes, levelRes, accountRes] = await Promise.all([
      request.get('/user/detail', { params: { uid } }),
      request.get('/user/subcount'),
      request.get('/user/level'),
      request.get('/user/account')
    ])

    const profile = {
      id: uid,
      nickname: accountRes.data.profile.nickname,
      avatarUrl: accountRes.data.profile.avatarUrl,
      signature: accountRes.data.profile.signature,
      vipType: accountRes.data.profile.vipType,
      level: levelRes.data.data.level || 0,
      listenSongs: levelRes.data.data.listenSongs || 0,
      playlistCount: detailRes.data.playlistCount || 0,
      follows: subcountRes.data.follows || 0,
      fans: subcountRes.data.followeds || 0
    }

    localStorage.setItem('userProfile', JSON.stringify(profile))
    return profile
  } catch (error) {
    console.error('刷新用户信息失败:', error)
    logout()
    return null
  }
}

// 退出登录
export function logout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('loginType')
  localStorage.removeItem('userProfile')
}
