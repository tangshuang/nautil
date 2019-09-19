import { Component } from '../core/component.js'

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
    const styles = { display: 'block', width, height: 0, borderBottom: `${thickness}px solid ${color}`, ...style }
    return <div {...props} className={className} style={styles}></div>
  }
}
export default Line
