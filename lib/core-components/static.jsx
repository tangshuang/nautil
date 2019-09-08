import Component from '../core/component.js'
import Section from '../components/section.jsx'

export class Static extends Component {
  shouldUpdate(nextProps) {
    return nextProps.shouldUpdate
  }
  render() {
    const { component, ...props } = this.attrs
    const C = component ? component : Section
    return <C {...props} style={this.style} className={this.className}>{this.children()}</C>
  }
}
export default Static
