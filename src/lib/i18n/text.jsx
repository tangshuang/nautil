import { Enum, ifexist } from 'tyshemo'
import { isFunction, isInstanceOf, mixin } from 'ts-fns'

import I18n from './i18n.js'
import _Text from '../elements/text.jsx'
import Component from '../component.js'

mixin(_Text, class {
  static props = {
    i18n: ifexist(I18n),
    t: ifexist(new Enum([Function, String])),
    s: ifexist(String),
  }
  onParseProps(props) {
    const { i18n, t, s, children } = props
    if (!i18n || !isInstanceOf(i18n, I18n) || !t) {
      return props
    }

    const key = s ? s + ':' + t : t

    let text
    if (isFunction(t)) {
      text = t(i18n, children)
    }
    else if (i18n.has(key)) {
      text = i18n.t([key, children])
    }
    else {
      text = children
    }

    return {
      ...props,
      children: text,
    }
  }
})

class Text extends Component {
  render() {
    return <_Text {...this.props} />
  }
}

export { _Text, Text }
export default Text
