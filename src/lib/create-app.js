import Navigator from './navi/navigator.jsx'
import Provider from './store/provider.jsx'
import Language from './i18n/language.jsx'
import { nest, pollute } from './operators/operators.js'
import Component from './component.js'
import { Any, ifexist, Ty } from 'tyshemo'
import Navigation from './navi/navigation.js'

export class AppWormhole extends Component {
  static props = {
    body: Any,
    transport: ifexist(Function),
    render: Function,
  }
  static defaultProps = {
    body: null,
  }
  render() {
    const { transport, body, render } = this.attrs
    const data = transport ? transport(body) : body
    return render(data)
  }
}

export function createApp(options = {}, fn) {
  const { navigation, store, i18n } = options
  const None = () => null

  const items = []

  if (store) {
    items.push([Provider, { store }])
  }
  if (i18n) {
    items.push([Language, { i18n }])
  }

  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(navigation).to.be(Navigation)
  }

  items.push([Navigator, { navigation, inside: true }])

  if (fn) {
    fn(items, options)
  }

  const Component = nest(...items)(None)
  const TopComponent = pollute(AppWormhole, { body: options })(Component)

  return TopComponent
}
