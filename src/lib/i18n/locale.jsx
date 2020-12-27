import I18n from './i18n.js'
import Component from '../component.js'
import { ifexist } from 'tyshemo'

/**
 * <Locale to="zh-CN" render={(changeLang) =>
 *   <Button onHit={changeLang}>Chinese</Button>
 * } />
 */
export class _Locale extends Component {
  static props = {
    i18n: I18n,
    map: ifexist(Function),
    render: ifexist(Function),
  }

  render() {
    const { i18n, map, render } = this.attrs
    const fn = render ? render : this.children
    const data = map ? map(i18n) : i18n
    return fn(data)
  }
}
export class Locale extends Component {
  render() {
    return <_Locale {...this.props} />
  }
}
export default Locale
