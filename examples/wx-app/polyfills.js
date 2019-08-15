import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
import depo from '../app/depo.js'

class HTMLIFrameElement extends HTMLElement {}

axios.defaults.adapter = mpAdapter
window.parseInt = Number.parseInt
window.parseFloat = Number.parseFloat
window.HTMLIFrameElement = HTMLIFrameElement

const { headers } = depo.options
depo.axios = axios.create({
  baseURL: 'http://localhost:8085',
  headers,
  // 不支持 timeout 配置
})
