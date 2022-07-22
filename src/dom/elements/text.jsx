import { Text } from '../../lib/elements/text.jsx'

Text.implement(class {
  render() {
    return <span {...this.attrs} className={this.className} style={this.style}>{this.children}</span>
  }
})

export { Text }
export default Text
