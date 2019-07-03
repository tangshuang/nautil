import Component from '../core/component.js'
import { enumerate } from '../core/types.js'
import Fragment from './fragment.jsx'
import { isArray, isObject, each } from '../core/utils.js'

export class For extends Component {
  static validateProps = {
    start: Number,
    end: Number,
    step: Number,
    map: Function,
  }
  static defaultProps = {
    step: 1,
  }

  render() {
    const { start, end, step, map } = this.props
    const blocks = []
    for (let i = start; i <= end; i += step) {
      const block = map(i)
      blocks.push(block)
    }
    return <Fragment>
      {blocks}
    </Fragment>
  }
}

export class Each extends Component {
  static validateProps = {
    of: enumerate([ Array, Object ]),
    map: Function,
  }

  render() {
    const { map } = this.props
    const data = this.props.of
    const blocks = []

    if (isArray(data)) {
      blocks.push(...data.map(map))
    }
    else if (isObject(data)) {
      each(data, (value, key) => {
        blocks.push(map(value, key))
      })
    }

    return <Fragment>
      {blocks}
    </Fragment>
  }
}
