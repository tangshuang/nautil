import Component from '../core/component.js'
import I18n from './i18n.js'
import Text from '../components/text.jsx'
import Observer from '../core-components/observer.jsx'
import { isFunction, mapChildren, cloneElement, filterChildren } from '../core/utils.js'
import { ifexist } from '../core/types.js'


export class T extends Component {
  static props = {
    i18n: I18n,
  }

  render() {
    const { i18n, t, s, ...rest } = this.attrs
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
      <Text stylesheet={[this.style, this.className]} {...rest}>{text}</Text>
    )
  }
}

export class Locale extends Component {
  static props = {
    i18n: I18n,
    to: String,
  }

  render() {
    const { i18n, to, component, ...rest } = this.attrs
    const children = this.children

    const change = () => {
      i18n.setLang(to)
    }

    const nodes = filterChildren(children)
    if (component || nodes.length > 1) {
      const C = component || Section
      return <C {...rest} onHint={change}>{nodes}</C>
    }
    else {
      return mapChildren(children, (child) => {
        if (child.type) {
          return cloneElement(child, { onHint: change })
        }
        else {
          return <Text {...rest} onHint={change}>{child}</Text>
        }
      })
    }
  }
}

export class Language extends Component {
  static props = {
    i18n: I18n,
    dispatch: ifexist(Function),
  }

  onInit() {
    const { i18n } = this.props
    this._pollutedComponents = [
      {
        component: T,
        props: { i18n },
      },
      {
        component: Locale,
        props: { i18n },
      },
    ]
  }

  render() {
    const { i18n, dispatch } = this.attrs
    const update = dispatch ? dispatch : this.update
    const children = this.children

    return (
      <Observer
        subscribe={dispatch => i18n.on('initialized', dispatch).on('loaded', dispatch).on('languageChanged', dispatch)}
        unsubscribe={dispatch => i18n.off('initialized', dispatch).off('loaded', dispatch).off('languageChanged', dispatch)}
        dispatch={update}
      >
        {isFunction(children) ? children(i18n) : children}
      </Observer>
    )
  }
}

export default Language
