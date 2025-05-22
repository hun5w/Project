import request from '@/utils/request'

// 获取某个分类下的歌单列表
export function getPlaylistsByCategory(cat) {
  return request({
    url: '/top/playlist',
    method: 'get',
    params: {
      cat,       // 分类名，例如：'怀旧'
      limit: 30  // 可以根据需要调整数量
    }
  })
}
