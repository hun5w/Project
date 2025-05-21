import { localUsers } from '@/data/users'

// 模拟登录
export function loginLocal(phone, password) {
  const user = localUsers.find(u => u.phone === phone && u.password === password)
  if (user) {
    saveLoginData(user)
    return user
  } else {
    throw new Error('手机号或密码错误')
  }
}

// 保存用户数据到 localStorage
export function saveLoginData(user) {
  localStorage.setItem('local_user', JSON.stringify(user))
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('loginType', 'user')
}

// 获取用户信息
export function getUserProfile() {
  const data = localStorage.getItem('local_user')
  return data ? JSON.parse(data) : null
}

// 是否已登录
export function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true'
}

// 退出登录
export function logout() {
  localStorage.removeItem('local_user')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('loginType')
}
