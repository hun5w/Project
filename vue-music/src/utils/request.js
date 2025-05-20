import axios from 'axios'

const service = axios.create({
  baseURL: 'https://netease-cloud-music-api.vercel.app/',
  timeout: 5000,
})

service.interceptors.response.use(
  response => response.data,
  error => {
    console.error('请求出错：', error)
    return Promise.reject(error)
  }
)

export default service
