import { Component } from '../core/component.js'
import { View } from 'react-native'

export class Line extends Component {
  static props = {
    length: Number,
    thick: Number,
    color: String,
  }
  static defaultProps = {
    length: 1,
    thick: 1,
    color: '#888888',
  }
  render() {
    const { width, thick, color = '#888888', ...rest } = this.attrs
    const styles = { width, height: 0, borderBottomColor: color, borderBottomWidth: thick, ...this.style }
    return <View {...rest} style={styles}></View>
  }
}
export default Line
