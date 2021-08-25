import { mixin } from 'ts-fns'
import { Link } from '../../lib/navi/link.jsx'

mixin(Link, class {
  $render(navigation) {
    const { open } = this.attrs
    return (
      <view catchtap={() => !open && this.goto(navigation)} style="display: inline">
        {this.children}
      </view>
    )
  }
})

export { Link }
export default Link
