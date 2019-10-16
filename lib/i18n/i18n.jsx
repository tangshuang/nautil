import Component from '../core/component.js'
import I18n from './i18n.js'
import Text from '../components/text.jsx'
import { isFunction, mapChildren, cloneElement, filterChildren } from '../core/utils.js'

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
    const { i18n, to, component, children, ...rest } = this.props

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
