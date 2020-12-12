import { list } from 'tyshemo'

import Component from '../component.js'

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
