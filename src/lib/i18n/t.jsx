import { Enum, ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import I18n from './i18n.js'
import _Text from '../elements/text.jsx'
import Component from '../component.js'

import { Consumer } from './context.js'

export class T extends Component {
  static props = {
    i18n: ifexist(I18n),
    t: ifexist(new Enum([Function, String])),
    s: ifexist(String),
  }

  render() {
    return (
      <Consumer>
        {(provided) => {
          const { i18n, t, s, children } = this.props
          const i = i18n || provided

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
        }}
      </Consumer>
    )
  }
}

export default T
