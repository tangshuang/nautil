import { Model } from './model.js'
import { each, getConstructorOf, isInstanceOf, isFunction } from 'ts-fns'
import Component from './component.js'
import { isShallowEqual } from './utils.js'

/**
 * class SomeController extends Constroller {
 *   vote$ = new Stream()
 *
 *   Vote = new VoteModel()
 *
 *   VoteButton(props) {
 *     return <Button onHit={vote$}>Vote</Button>
 *   }
 *
 *   VoteCount(props) {
 *     return <Text>{this.Vote.count}</Text>
 *   }
 * }
 */
export class Controller {
  constructor() {
    const emiters = []
    const emit = () => {
      emiters.forEach(fn => fn())
    }

    each(this, (value) => {
      if (!isInstanceOf(value, Model)) {
        return
      }
      value.watch('*', emit, true)
    })

    const Constructor = getConstructorOf(this)
    const protos = Constructor.proptotypes
    each(protos, (value, key) => {
      if (!isFunction(value)) {
        return
      }

      const charCode = key.charCodeAt(0)
      if (charCode < 65 || charCode > 90) {
        return
      }

      this[key] = class extends Component {
        onInit() {
          emiters.push(this.forceUpdate)
        }
        onUnmount() {
          emiters.forEach((fn, i) => {
            if (fn === this.forceUpdate) {
              emiters.splice(i, 1)
            }
          })
        }
        shouldUpdate(nextProps) {
          return !isShallowEqual(nextProps, this.props)
        }
        render() {
          return value(this.props)
        }
      }
    })
  }
}
