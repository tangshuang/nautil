import { Component } from '../core/component.js'

export class Line extends Component {
  render() {
    const { width, thick, color, ...rest } = this.attrs
    const styles = { display: 'block', borderBottom: `${thick}px solid ${color}`, width, height: 0, ...this.style }
    return <div {...rest} className={this.className} style={styles}></div>
  }
}
export default Line
