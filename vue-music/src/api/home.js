import service from '@/utils/request'

// 获取轮播图
export function getBanners() {
  // type=1 表示安卓设备，可以按需改成0/1/2
  return service.get('/banner?type=1')
}

// 获取推荐歌单
export function getRecommendPlaylists() {
  return service.get('/personalized')
}
