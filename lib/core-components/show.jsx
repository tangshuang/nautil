import Component from '../core/component.js'
import Section from '../components/section.jsx'

export class Show extends Component {
  render() {
    const { is, component, ...attrs } = this.attrs
    const C = component ? component : Section

    const style = { ...this.style }
    if (!is) {
      style.display = 'none'
    }

    return <C {...attrs} style={style} className={this.className}>{this.children}</C>
  }
}
export default Show
