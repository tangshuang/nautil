// import axios from 'axios'
// import mpAdapter from 'axios-miniprogram-adapter'

// axios.defaults.adapter = mpAdapter
// axios.defaults.timeout = undefined

window.parseInt = Number.parseInt
window.parseFloat = Number.parseFloat
window.HTMLIFrameElement = class HTMLIFrameElement extends HTMLElement {}

// https://gist.github.com/paulirish/1579671
// in mp.config.js, should must set globalVars option
;(function() {
  let lastTime = 0
  window.requestAnimationFrame = function(callback) {
    const currTime = +new Date()
    const timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
    const id = setTimeout(() => callback(currTime + timeToCall), timeToCall)
    lastTime = currTime + timeToCall
    return id
  }
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id)
  }
}());
