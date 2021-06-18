import { mixin } from 'ts-fns'
import { Navigation } from '../../lib/navi/navigation.js'
import { Storage } from '../../lib/storage/storage.js'

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

  _getMode() {
    const { mode = '' } = this.options

    if (!mode) {
      return { mode: 'memo', query: '', base: '' }
    }

    if (mode.indexOf('#?') === 0) {
      const [query, base = ''] = mode.substring(2).split('=')
      return { mode: 'search', query, base }
    }

    if (mode.indexOf('?') === 0) {
      const [query, base = ''] = mode.substring(1).split('=')
      return { mode: 'search', query, base }
    }

    if (mode.indexOf('/') === 0 || mode.indexOf('#') === 0) {
      return { mode: 'search', query: 'url', base: '' }
    }

    return { mode: 'storage', query: '', base: '' }
  }

  async changeLocation(nextState, replace = false) {
    const { mode, query, base } = this._getMode()
    if (mode === 'storage') {
      await Storage.setItem('historyState', nextState)
    }
    else if (mode === 'search') {
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
