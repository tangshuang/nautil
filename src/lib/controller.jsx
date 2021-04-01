import React from 'react'
import { Model } from './model.js'
import { Store } from './store/store.js'
import { each, getConstructorOf, isInheritedOf, isFunction } from 'ts-fns'
import Component from './component.js'
import { isShallowEqual } from './utils.js'
import { Stream } from './stream.js'
import { Service } from './service.js'

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
    let activeComponents = 0

    const emitters = []
    const emit = () => {
      emitters.forEach(fn => fn())
      this.onUpdate()
    }

    this.update = emit

    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (Item, key) => {
      if (Item && isInheritedOf(Item, Service)) {
        this[key] = Item.getService()
      }
      else if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
        this[key].watch('*', emit, true)
        this[key].watch('!', emit)
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

    // developers should must extends Controller and overwrite `init` method to initailize
    this.init()

    const controller = this
    const protos = Constructor.prototype
    const props = { ...controller, ...protos }
    each(props, ({ value }, key) => {
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
          emitters.push(this.forceUpdate)
          if (!activeComponents) {
            controller.onStart()
          }
          activeComponents ++
        }
        onUnmount() {
          emitters.forEach((fn, i) => {
            if (fn === this.forceUpdate) {
              emitters.splice(i, 1)
            }
          })
          activeComponents --
          if (!activeComponents) {
            controller.onEnd()
          }
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
  init() {}
  onStart() {}
  onUpdate() {}
  onEnd() {}
}
