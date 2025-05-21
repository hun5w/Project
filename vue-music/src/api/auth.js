import request from '@/utils/request'

export function sendCaptcha(phone) {
  return request.get('/captcha/sent', {
    params: { phone }
  })
}

export async function loginWithCaptcha(phone, captcha) {
  const res = await request.get('/login/cellphone', {
    params: { phone, captcha }
  })

  if (res.data.code !== 200) {
    throw new Error(res.data.message || '登录失败')
  }

  const uid = res.data.account.id
  const detail = await request.get('/user/detail', { params: { uid } })

  const profile = {
    ...res.data.profile,
    level: detail.data.level,
    listenSongs: detail.data.listenSongs,
    playlistCount: detail.data.profile.playlistCount,
    follows: detail.data.profile.follows,
    fans: detail.data.profile.followeds
  }

  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('loginType', 'captcha')
  localStorage.setItem('userProfile', JSON.stringify(profile))

  return profile
}

// 记得加上这个函数的导出
export function getUserProfile() {
  const json = localStorage.getItem('userProfile')
  return json ? JSON.parse(json) : null
}
