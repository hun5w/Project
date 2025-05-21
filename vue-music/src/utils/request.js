import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000', // 你本地运行 NeteaseCloudMusicApi 的地址
  withCredentials: true, // 确保 cookie 跨域有效
  timeout: 10000
})

export default request
