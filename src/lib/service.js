import { each, getConstructorOf, isInheritedOf, isFunction } from 'ts-fns'
import { Stream } from './stream.js'
import { Model } from './model.js'

export class Service {
  constructor() {
    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (Item, key) => {
      if (Item && isInheritedOf(Item, Service)) {
        this[key] = new Item()
      }
      else if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([Item, stream$])
      }
    })
    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([fn, stream$]) => fn.call(this, stream$))
  }
  $new() {
    const Constructor = getConstructorOf(this)
    return new Constructor()
  }
  static getInstance() {
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
