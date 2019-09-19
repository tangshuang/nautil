import { Component } from '../core/component.js'
import { View } from 'react-native'

export class Line extends Component {
  static props = {
    length: Number,
    thickness: Number,
    color: String,
  }
  static defaultProps = {
    length: Infinity,
    thickness: 1,
    color: '#888888',
  }
  render() {
    const {
      className,
      style,
      attrs,
    } = this
    const { width, thickness, color, ...props } = attrs
    const styles = { width, height: 0, borderBottomColor: color, borderBottomWidth: thickness, ...style }
    return <View {...props} style={styles}></View>
  }
}
export default Line
