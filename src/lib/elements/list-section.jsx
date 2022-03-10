import { list } from 'tyshemo'

import Component from '../core/component.js'

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

export default ListSection
