import { mixin } from 'ts-fns'
import { Router } from '../../lib/router/router.jsx'
import { History } from '../../lib/router/history.js'
import { revokeUrl } from '../../lib/utils.js'

class WechatHistory extends History {
  $getUrl(abs, mode) {
    const { query, base } = mode
    const root = base && base !== '/' ? base + abs : abs

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const { options = {} } = currentPage
    const search = options[query] || ''

    const url = decodeURIComponent(search)
    return revokeUrl(root, url)
  }
  $setUrl(to, abs, mode, replace) {
    const url = this.$makeUrl(to, abs, mode)
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
  $makeUrl(to, abs, mode) {
    const { query, base } = mode
    const url = resolveUrl(base, resolveUrl(abs, to))
    const encoded = encodeURIComponent(url)

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const { route } = currentPage
    const page = route.split('/').pop()
    return page + '?' + query + '=' + encoded
  }
}

History.implement('search', WechatHistory)

mixin(Router, class {
  $createLink(data) {
    const { children, href, open, navigate, ...attrs } = data
    const handleClick = () => {
      if (open) {
        wx.navigateToMiniProgram({
          appId: process.env.WECHAT_MINIPROGRAM_APP_ID,
          path: href,
        })
      }
      else {
        navigate()
      }
    }
    return (
      <view {...attrs} catchtap={handleClick} style="display: inline">{children}</view>
    )
  }
})

export { Router }
export default Router
