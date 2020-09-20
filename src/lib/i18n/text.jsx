import { Enum, ifexist } from 'tyshemo'
import { isFunction, isInstanceOf, mixin } from 'ts-fns'

import I18n from './i18n.js'
import Text from '../elements/text.jsx'

mixin(Text, class {
  static props = {
    i18n: ifexit(I18n),
    t: ifexit(new Enum([Function, String])),
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

export { Text }
export default Text
