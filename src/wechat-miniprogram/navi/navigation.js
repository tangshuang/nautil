import { mixin } from 'ts-fns'
import Navigation from '../../lib/navi/navigation.js'

mixin(Navigation, class {
  async open(url, params) {}
})

export { Navigation }
export default Navigation
