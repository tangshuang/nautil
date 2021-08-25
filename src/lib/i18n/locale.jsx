import I18n from './i18n.js'
import Component from '../component.js'
import { ifexist } from 'tyshemo'

import { Consumer } from './context.js'

/**
 * <Locale to="zh-CN" render={(changeLang) =>
 *   <Button onHit={changeLang}>Chinese</Button>
 * } />
 */
export class Locale extends Component {
  static props = {
    i18n: ifexist(I18n),
    map: ifexist(Function),
    render: ifexist(Function),
  }

  render() {
    return (
      <Consumer>
        {(provided) => {
          const { i18n, map, render } = this.attrs
          const i = i18n || provided
          const fn = render ? render : this.children
          const data = map ? map(i) : i
          return fn(data)
        }}
      </Consumer>
    )
  }
}
export default Locale
