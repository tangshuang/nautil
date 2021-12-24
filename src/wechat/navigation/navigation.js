import { mixin } from 'ts-fns'
import { Navigation } from '../../lib/navigation/navigation.js'

mixin(Navigation, class {
  // used by .is()
  getState() {
    if (this.status <= 0) {
      return
    }

    const { mode, query } = this._getMode()
    if (mode !== 'search') {
      return this.state
    }

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const { options = {} } = currentPage
    const search = options[query]

    if (!search) {
      return
    }

    const url = decodeURIComponent(search)
    const state = this.parseUrlToState(url)
    return state
  }

  mapMode(info) {
    const { mode } = info
    if (mode === 'hash' || mode === 'history') {
      return { ...info, mode: 'search', query: 'url' }
    }
    if (mode === 'hash_search') {
      return { ...info, mode: 'search' }
    }
    return info
  }

  async setBrowserUrl(nextState, replace = false) {
    const { query, base } = this.getMode()
    const { path } = nextState
    const href = encodeURIComponent(base + path)
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const { route } = currentPage
    const page = route.split('/').pop()
    const url = page + '?' + query + '=' + href

    if (replace) {
      wx.redirectTo({
        path: url,
      })
    }
    else {
      wx.navigateTo({
        path: url,
      })
    }
  }

  async open(to, params) {
    const url = this.makeUrl(to, params)
    wx.navigateToMiniProgram({
      appId: process.env.WECHAT_MINIPROGRAM_APP_ID,
      path: url,
    })
  }
})

export { Navigation }
export default Navigation
