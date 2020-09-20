import React from 'react'
import { mixin } from 'ts-fns'
import { Text as NativeText } from 'react-native'
import Text from '../../lib/elements/text.jsx'

mixin(Text, class {
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
