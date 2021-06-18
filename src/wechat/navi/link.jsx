import { mixin } from 'ts-fns'
import { _Link as Link } from '../../lib/navi/link.jsx'

mixin(Link, class {
  render() {
    const { open } = this.attrs
    return (
      <text catchtap={() => !open && this.goto()}>
        {this.children}
      </text>
    )
  }
})

export { Link }
export default Link
