import { Component } from '../core/component.js'
import { TouchableOpacity } from 'react-native'

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
    >{this.children}</TouchableOpacity>
  }
}
export default Button
