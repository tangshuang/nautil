import { Text as NativeText } from 'react-native'
import { Text } from '../../lib/elements/text.jsx'

Text.implement(class {
  render() {
    return (
      <NativeText
        className={this.className}
        style={this.style}
        {...this.attrs}
      >{this.children}</NativeText>
    )
  }
})

export { Text }
export default Text
