import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('../views/login/LoginIndex.vue')
    },
    {
      path: '/register',
      component: () => import('@/views/login/RegisterIndex.vue')
    },
    {
      path: '/mine',
      component: () => import('../views/mine/MineIndex.vue')
    },
    {
      path: '/finding',
      component: () => import('../views/finding/FindingIndex.vue')
    },

    // 分类歌单列表页，使用query参数或params都可以，这里按你之前的用法：
    {
      path: '/playlist',
      component: () => import('../views/finding/components/CategoryDetail.vue')
    },

    // 歌单详情页，展示歌单中的歌曲列表
    {
      path: '/playlist/detail/:playlistId',
      component: () => import('../components/SongList.vue')
    },

    // 歌曲播放详情页
    {
      path: '/song/:songId',
      component: () => import('../components/SongDetail.vue')
    },

    {
      path: '/note',
      component: () => import('../views/note/NoteIndex.vue')
    },
    {
      path: '/home',
      component: () => import('../views/home/HomeIndex.vue')
    },
    // src/router/index.js
    {
      path: '/search',
      name: 'SearchResult',
      component: () => import('../views/home/SearchResult.vue')
    },

  ]
})

export default router
