import { Enum, ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import I18n from './i18n.js'
import Component from '../component.js'

import { Consumer } from './context.js'
import { decorate } from '../operators/operators.js'

class _T extends Component {
  static props = {
    i18n: I18n,
    t: ifexist(new Enum([Function, String])),
    s: ifexist(String),
  }

  render() {
    const { i18n, t, s, children } = this.props
    const i = i18n

    if (!i || !t) {
      return children
    }

    const key = s ? s + ':' + t : t

    let text
    if (isFunction(t)) {
      text = t(i, children)
    }
    else if (i.has(key)) {
      text = i.t([key, children])
    }
    else {
      text = children
    }

    return text
  }
}

export const T = decorate(Consumer, ['i18n'])(_T)
export default T
