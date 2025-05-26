import request from '@/utils/request'

// 综合搜索（更全）
export function cloudSearch({ keywords, type = 1, limit = 30, offset = 0 }) {
  return request.get('/cloudsearch', {
    params: {
      keywords,
      type,
      limit,
      offset
    }
  })
}
