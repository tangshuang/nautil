import Component from '../core/component.js'
import { list } from '../core/types.js'

export class ListSection extends Component {
  static props = {
    data: list([Object]),
    itemRender: Function,
    itemKey: String,
    itemStyle: Object,
  }

  static defaultProps = {
    itemStyle: {},
  }
}
