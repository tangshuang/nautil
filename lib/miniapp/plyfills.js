import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

class HTMLIFrameElement extends HTMLElement {}

axios.defaults.adapter = mpAdapter
window.parseInt = Number.parseInt
window.parseFloat = Number.parseFloat
window.HTMLIFrameElement = HTMLIFrameElement
