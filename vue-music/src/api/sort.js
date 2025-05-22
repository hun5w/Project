// src/api/sort.js

import request from '@/utils/request' // 你项目中封装的 request 方法

// 获取歌单分类
export function getCatList() {
  return request.get('/playlist/catlist')
}

// 获取热门歌单分类
export function getHotCatList() {
  return request.get('/playlist/hot')
}
