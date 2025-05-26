// src/api/auth.js

import { defaultUsers } from '@/data/user'

const USERS_KEY = 'users'
const PROFILE_KEY = 'userProfile'

export function loadUsers() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY))
  return users || [...defaultUsers]
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser({ username, password, nickname, phone }) {
  const users = loadUsers()

  if (users.find(u => u.username === username)) {
    throw new Error('该用户名已存在')
  }
  if (users.find(u => u.phone === phone)) {
    throw new Error('该手机号已被绑定')
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
    nickname: nickname || username,
    phone,
    avatarUrl: 'https://img.icons8.com/color/96/user.png',
    signature: '这个人很懒，什么都没有留下~',
    level: 1,
    vipType: 0,
    listenSongs: 0,
    playlistCount: 0,
    follows: 0,
    fans: 0
  }

  users.push(newUser)
  saveUsers(users)
  localStorage.setItem(PROFILE_KEY, JSON.stringify(newUser))
  return newUser
}

export function loginUser({ username, password }) {
  const users = loadUsers()
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) throw new Error('用户名或密码错误')

  localStorage.setItem(PROFILE_KEY, JSON.stringify(user))
  localStorage.setItem('current_user', JSON.stringify(user))

  return user
}

export function getUserProfile() {
  return JSON.parse(localStorage.getItem(PROFILE_KEY))
}

export function logoutUser() {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem('current_user')
}

export function recoverPassword({ username, phone, newPassword }) {
  const users = loadUsers()
  const userIndex = users.findIndex(u => u.username === username && u.phone === phone)

  if (userIndex === -1) {
    throw new Error('账号与手机号不匹配')
  }

  users[userIndex].password = newPassword
  saveUsers(users)
  return true
}
