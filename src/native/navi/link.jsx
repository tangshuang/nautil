import { mixin } from 'ts-fns'
import { _Link as Link } from '../../lib/navi/link.jsx'
import Text from '../../lib/elements/text.jsx'

mixin(Link, class {
  render() {
    const { open } = this.attrs
    return <Text
      className={this.className}
      style={this.style}
      onClick={e => !open && (e.preventDefault(),this.goto())}
    >{this.children}</Text>
  }
})

export { Link }
export default Link
