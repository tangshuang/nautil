
import './storage.attach.js'
import './navigation.attach.js'
import './depository.attach.js'
import '../dom/style.attach.js'

import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

class HTMLIFrameElement extends HTMLElement {}

axios.defaults.adapter = mpAdapter
axios.defaults.timeout = undefined
window.parseInt = Number.parseInt
window.parseFloat = Number.parseFloat
window.HTMLIFrameElement = HTMLIFrameElement

// https://gist.github.com/paulirish/1579671
// in mp.config.js, should must set globalVars option
;(function() {
  let lastTime = 0

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      const currTime = +new Date()
      const timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
      const id = setTimeout(() => callback(currTime + timeToCall), timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id)
    }
  }
}());
