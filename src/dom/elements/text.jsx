import React from 'react'
import { mixin } from 'ts-fns'
import Text from '../../lib/elements/text.jsx'

mixin(Text, class {
  render() {
    return <span {...this.attrs} className={this.className} style={this.style}>{this.children}</span>
  }
})

export { Text }
export default Text
