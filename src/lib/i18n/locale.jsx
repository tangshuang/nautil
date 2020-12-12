import I18n from './i18n.js'
import Component from '../component.js'

/**
 * <Locale to="zh-CN" render={(changeLang) =>
 *   <Button onHit={changeLang}>Chinese</Button>
 * } />
 */
export class _Locale extends Component {
  static props = {
    i18n: I18n,
    to: String,
    render: Function,
  }

  render() {
    const { i18n, to, render } = this.attrs
    const changeLang = () => {
      i18n.setLang(to)
    }

    return render(changeLang)
  }
}
export class Locale extends Component {
  render() {
    return <_Locale {...this.props} />
  }
}
export default Locale
