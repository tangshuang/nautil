import { mixin } from 'ts-fns'
import Text from '../../lib/elements/text.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Text, class {
  render() {
    return <text {...this.attrs} class={this.className} style={Style.stringify(this.style)}>{this.children}</text>
  }
})

export { Text }
export default Text
