import { Component } from '../core/component.js'

export class Text extends Component {
  render() {
    return <span
      className={this.className}
      style={this.style}
      {...this.attrs}
    >{this.children}</span>
  }
}
export default Text
