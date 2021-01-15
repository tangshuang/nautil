import { each, getConstructorOf, isInheritedOf, isFunction } from 'ts-fns'
import { Stream } from './stream.js'
import { Model } from './model.js'

export class Service {
  constructor() {
    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (Item, key) => {
      if (Item && isInheritedOf(Item, Service)) {
        this[key] = Item.getService()
      }
      else if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([stream$, Item])
      }
    })
    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([stream$, fn]) => fn.call(this, stream$))
  }
  $new() {
    const Constructor = getConstructorOf(this)
    return new Constructor()
  }
  destroy() {
    each(this, (value, key) => {
      if (isInstanceOf(value, Stream)) {
        value.complete()
        delete this[key]
      }
    })
    const Constructor = getConstructorOf(this)
    if (Constructor.__instance === this) {
      delete Constructor.__instance
    }
  }
  static getService() {
    const Constructor = this
    if (Constructor.__instance) {
      return Constructor.__instance
    }
    else {
      const instance = new Constructor()
      Constructor.__instance = instance
      return instance
    }
  }
}
export default Service
