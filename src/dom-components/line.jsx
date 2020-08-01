import { Component } from '../core/component.js'

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
    const { width, thick, color, ...rest } = this.attrs
    const styles = { display: 'block', borderBottom: `${thick}px solid ${color}`, width, height: 0, ...this.style }
    return <div {...rest} className={this.className} style={styles}></div>
  }
}
export default Line
