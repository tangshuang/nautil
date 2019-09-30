import { Component } from '../core/component.js'

export class Line extends Component {
  render() {
    const { width, thick, color, ...rest } = this.attrs
    const styles = { display: 'block', borderBottom: `${thick}px solid ${color}`, ...this.style, width, height: 0 }
    return <div {...rest} className={this.className} style={styles}></div>
  }
}
export default Line
