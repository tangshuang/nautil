import { Component } from '../core/component.js'
import { TouchableOpacity, Text } from 'react-native'

export class Button extends Component {
  render() {
    const { color } = this.style
    return <TouchableOpacity
      onPress={e => this.onHint$.next(e)}

      onPressIn={e => this.onHintStart$.next(e)}
      onPressOut={e => this.onHintEnd$.next(e)}

      className={this.className}
      style={this.style}
      color={color}

      {...this.attrs}
    ><Text>{this.children}</Text></TouchableOpacity>
  }
}
export default Button
