import Component from '../core/component.js'
import { Section } from '../components/index.js'

export class Show extends Component {
  render() {
    const { is, component, ...rest } = this.attrs
    const C = component ? component : Section

    const style = { ...this.style }
    if (!is) {
      style.display = 'none'
    }

    return <C {...rest} style={style} className={this.className}>{this.children}</C>
  }
}
export default Show
