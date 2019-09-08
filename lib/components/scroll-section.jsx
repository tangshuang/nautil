import Component from '../core/component.js'
import { noop } from '../core/utils.js'

export class ScrollSection extends Component {
  static props = {
    horizontal: Boolean,
    vertical: Boolean,

    onScroll: Function,
  }

  static defaultProps = {
    horizontal: false,
    vertical: false,

    onScroll: noop,
  }
}
export default ScrollSection
