import { mixin } from 'ts-fns'
import { _Link, Link } from '../../lib/navigation/link.jsx'
import { TouchableOpacity } from 'react-native'

mixin(_Link, class {
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
