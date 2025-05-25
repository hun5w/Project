import request from '@/utils/request'

export function getSongDetail(songId) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: { ids: songId }
  })
}

export function getSongUrl(songId, level = 'standard') {
  return request({
    url: '/song/url/v1',
    method: 'get',
    params: { id: songId, level }
  })
}

export function checkMusic(songId) {
  return request({
    url: '/check/music',
    method: 'get',
    params: { id: songId }
  })
}