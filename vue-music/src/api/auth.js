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

export function registerUser({ username, password }) {
  const users = loadUsers()
  if (users.find(u => u.username === username)) {
    throw new Error('该用户名已存在')
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
    nickname: username,
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
  return user
}

export function getUserProfile() {
  return JSON.parse(localStorage.getItem(PROFILE_KEY))
}

export function logoutUser() {
  localStorage.removeItem(PROFILE_KEY)
}