import { mixin } from 'ts-fns'
import { _Link as Link } from '../../lib/navi/link.jsx'

mixin(Link, class {
  render() {
    const { open } = this.attrs
    return (
      <view catchtap={() => !open && this.goto()} style="display: inline">
        {this.children}
      </view>
    )
  }
})

export { Link }
export default Link
