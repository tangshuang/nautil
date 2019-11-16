import { Component } from '../core/component.js'
import { Text as NativeText } from 'react-native'

export class Text extends Component {
  render() {
    return <NativeText
      className={this.className}
      style={this.style}
      {...this.attrs}
    >{this.children}</NativeText>
  }
}
export default Text
