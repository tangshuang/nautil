import { mixin } from 'ts-fns'
import { Navigation } from '../../lib/navi/navigation.js'

mixin(Navigation, class {
  async changeLocation(state, replace = false) {
    const { url } = state
    if (replace) {
      wx.redirectTo({
        appId: process.env.WECHAT_MINIPROGRAM_APP_ID,
        path: url,
      })
    }
    else {
      wx.navigateTo({
        appId: process.env.WECHAT_MINIPROGRAM_APP_ID,
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
