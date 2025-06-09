import request from '@/utils/request'

// 获取歌曲详情（包含歌曲名、封面图、歌手等）
export function getSongDetail(songId) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: { ids: songId }
  })
}

// 获取歌曲播放链接（支持设置音质 level，如 standard, exhigh, lossless）
export function getSongUrl(songIds, level = 'standard') {
  const idParam = Array.isArray(songIds) ? songIds.join(',') : songIds
  return request({
    url: '/song/url/v1',
    method: 'get',
    params: { id: idParam, level }
  })
}


// 检查歌曲是否可用（VIP/版权等问题）
export function checkMusic(songId) {
  return request({
    url: '/check/music',
    method: 'get',
    params: { id: songId }
  })
}

// ✅ 获取歌词
export function getLyric(songId) {
  return request({
    url: '/lyric',
    method: 'get',
    params: { id: songId }
  })
}

// ✅ 获取歌曲评论（分页加载，默认获取第一页20条）
export function getSongComments(songId, limit = 20, offset = 0) {
  return request({
    url: '/comment/music',
    method: 'get',
    params: {
      id: songId,
      limit,
      offset
    }
  })
}

// ✅ 获取相似歌曲推荐（例如根据当前播放歌曲推荐）
export function getSimiSongs(songId) {
  return request({
    url: '/simi/song',
    method: 'get',
    params: { id: songId }
  })
}
