import React from 'react'
import { Model } from './model.js'
import { Store } from './store/store.js'
import { each, getConstructorOf, isInheritedOf, isFunction } from 'ts-fns'
import Component from './component.js'
import { isShallowEqual } from './utils.js'
import { Stream } from './stream.js'

/**
 * class SomeController extends Constroller {
 *   static vote = VoteModel
 *
 *   static vote$(stream) {
 *     stream.subscribe(() => this.vote.count ++ )
 *   }
 *
 *   VoteButton(props) {
 *     return <Button onHit={this.vote$}>Vote</Button>
 *   }
 *
 *   VoteCount(props) {
 *     return <Text>{this.vote.count}</Text>
 *   }
 * }
 */
export class Controller {
  constructor() {
    const emiters = []
    const emit = () => {
      emiters.forEach(fn => fn())
    }

    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (Item, key) => {
      if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
        this[key].watch('*', emit, true)
      }
      else if (Item && (Item === Store || isInheritedOf(Item, Store))) {
        this[key] = new Item()
        this[key].subscribe(emit)
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([Item, stream$])
      }
    })
    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([fn, stream$]) => fn.call(this, stream$))

    const protos = Constructor.prototype
    each(protos, ({ value }, key) => {
      if (key === 'constructor') {
        return
      }

      if (!isFunction(value)) {
        return
      }

      const charCode = key.charCodeAt(0)
      // if not uppercase, make it as a method
      if (charCode < 65 || charCode > 90) {
        this[key] = value.bind(this)
        return
      }

      const Gen = value.bind(this)

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
          return <Gen {...this.props} />
        }
      }
    }, true)
  }
}
