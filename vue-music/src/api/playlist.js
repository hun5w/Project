import request from '@/utils/request'

export function getPlaylistDetail(playlistId) {
  return request({
    url: '/playlist/detail',
    method: 'get',
    params: { id: playlistId }
  })
}