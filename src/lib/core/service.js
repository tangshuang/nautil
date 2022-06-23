import { each, getConstructorOf, isInheritedOf, isFunction } from 'ts-fns'
import { Stream } from './stream.js'
import { Model } from 'tyshemo'
import { PrimitiveBase } from '../utils.js'

export class Service extends PrimitiveBase {
  __init() {
    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (_, key) => {
      const Item = Constructor[key]
      if (Item && isInheritedOf(Item, Service)) {
        this[key] = Item.instance()
      }
      else if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([stream$, Item])
      }
    }, true)
    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([stream$, fn]) => fn.call(this, stream$))
  }
}
export default Service
