import { mixin } from 'ts-fns'
import { _Link as Link } from '../../lib/navi/link.jsx'
import { TouchableOpacity } from 'react-native'

mixin(Link, class {
  render() {
    const { open } = this.attrs
    return (
      <TouchableOpacity onPress={e => !open && (e.preventDefault(),this.goto())}>
        {this.children}
      </TouchableOpacity>
    )
  }
})

export { Link }
export default Link
