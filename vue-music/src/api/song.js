import request from '@/utils/request'

export function getSongDetail(songId) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: { ids: songId }
  })
}

export function getSongUrl(songId) {
  return request({
    url: '/song/url',
    method: 'get',
    params: { id: songId }
  })
}