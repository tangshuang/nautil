import Component from '../core/component.js'
import I18n from './i18n.js'
import Observer from '../core-components/observer.jsx'
import { ifexist } from '../core/types.js'
import Text from '../components/text.jsx'
import { isFunction, mapChildren, cloneElement, filterChildren } from '../core/utils.js'

export class Language extends Component {
  static props = {
    i18n: I18n,
    dispatch: ifexist(Function),
  }

  onRender() {
    const { i18n } = this.attrs

    const T_Originals = T.defaultProps
    const T_hasUse = T_Originals || {}
    const T_willUse = { ...T_hasUse, i18n }
    T.defaultProps = T_willUse
    this._T_defaultProps = T_Originals

    const localeOriginals = Locale.defaultProps
    const localeHasUse = localeOriginals || {}
    const localeWillUse = { ...localeHasUse, i18n }
    Locale.defaultProps = localeWillUse
    this._localeDefaultProps = localeOriginals
  }

  onRendered() {
    const T_Originals = this._T_defaultProps
    T.defaultProps = T_Originals

    const localeOriginals = this._localeDefaultProps
    Locale.defaultProps = localeOriginals
  }

  render() {
    const { i18n, dispatch } = this.attrs
    const update = dispatch ? dispatch : this.update

    return (
      <Observer
        subscribe={dispatch => i18n.on('initialized', dispatch).on('loaded', dispatch).on('languageChanged', dispatch)}
        unsubscribe={dispatch => i18n.off('initialized', dispatch).off('loaded', dispatch).off('languageChanged', dispatch)}
        dispatch={update}
      >
        {isFunction(this.children) ? this.children(i18n) : this.children}
      </Observer>
    )
  }
}

export default Language

export class T extends Component {
  static props = {
    i18n: I18n,
  }

  render() {
    const { i18n, t, s, ...props } = this.attrs
    const children = this.children
    const namespace = s ? s + ':' : ''

    let text
    if (isFunction(t)) {
      text = t(i18n)
    }
    else if (i18n.has(namespace + t)) {
      text = i18n.t(namespace + t)
    }
    else if (isFunction(children)) {
      text = children(i18n)
    }
    else if (i18n.has(namespace + children)) {
      text = i18n.t(namespace + children)
    }
    else {
      text = children
    }

    return (
      <Text stylesheet={[this.style, this.className]} {...props}>{text}</Text>
    )
  }
}

export class Locale extends Component {
  static props = {
    i18n: I18n,
    to: String,
  }

  render() {
    const { i18n, to, component, children, ...props } = this.props

    const change = () => {
      i18n.setLang(to)
    }

    const nodes = filterChildren(children)
    if (component || nodes.length > 1) {
      const C = component || Section
      return <C {...props} onHint={change}>{nodes}</C>
    }
    else {
      return mapChildren(children, (child) => {
        if (child.type) {
          return cloneElement(child, { onHint: change })
        }
        else {
          return <Text {...props} onHint={change}>{child}</Text>
        }
      })
    }
  }
}
