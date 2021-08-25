import { mixin } from 'ts-fns'
import { Link } from '../../lib/navi/link.jsx'
import { TouchableOpacity } from 'react-native'

mixin(Link, class {
  $render(navigation) {
    const { open } = this.attrs
    return (
      <TouchableOpacity onPress={e => !open && (e.preventDefault(),this.goto(navigation))}>
        {this.children}
      </TouchableOpacity>
    )
  }
})

export { Link }
export default Link
