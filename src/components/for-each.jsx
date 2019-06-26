import Component from '../core/component'
import { enumerate } from '../core/types'

export class For extends Component {
  static PropTypes = {
    start: Number,
    end: Number,
    step: Number,
    map: Function,
  }
}

export class Each extends Component {
  static PropTypes = {
    data: enumerate(Array, Object),
    map: Function,
  }
}