import { Model } from './model.js'
import { Store } from '../store/store.js'
import { each, getConstructorOf, isInheritedOf, isFunction, isInstanceOf, isObject } from 'ts-fns'
import { Stream } from './stream.js'
import { Service } from './service.js'
import { DataService } from '../services/data-service.js'
import { SingleInstanceBase } from '../utils.js'

/**
 * class SomeController extends Constroller {
 *   static vote = VoteModel
 *
 *   static vote$(stream) {
 *     stream.subscribe(() => this.vote.count ++ )
 *   }
 * }
 */
export class Controller extends SingleInstanceBase {
  constructor() {
    super()

    this.observers = []
    this.emitters = []

    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (_, key) => {
      const Item = Constructor[key]
      if (Item && isInheritedOf(Item, DataService)) {
        this[key] = Item.instance()
        // notice that, any data source change will trigger the rerender
        // so you should must pass collect to determine when to rerender, look into example of `reactive`
        this.observe((dispatch) => {
          this[key].subscribe(dispatch)
          return () => this[key].unsubscribe(dispatch)
        })
      }
      else if (Item && isInheritedOf(Item, Service)) {
        this[key] = Item.instance()
      }
      else if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
        this.observe(this[key])
      }
      else if (Item && (Item === Store || isInheritedOf(Item, Store))) {
        this[key] = new Item()
        this.observe(this[key])
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([Item, stream$])
      }
    }, true)
    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([fn, stream$]) => fn.call(this, stream$))

    // start
    this.observers.forEach(({ start }) => start())

    // developers should must extends Controller and overwrite `init` method to initailize
    this.init()
  }

  init() {}

  subscribe(fn) {
    this.emitters.push(fn)
  }

  unsubscribe(fn) {
    if (this.isDied) {
      return
    }
    this.emitters = this.emitters.filter(item => item !== fn)
  }

  dispatch = () => {
    this.emitters.forEach((fn) => {
      fn()
    })
  }

  destroy() {
    super.destroy()

    // when controller is not active, clear all
    if (this.isDied) {
      this.observers.forEach(({ stop }) => stop())
      this.observers = null
      this.emitters = null
    }
  }

  observe(observer) {
    if (isInstanceOf(observer, Store)) {
      const subscription = {
        start: () => observer.subscribe(this.dispatch),
        stop: () => observer.unsubscribe(this.dispatch),
        observer,
      }
      this.observers.push(subscription)
    }
    else if (isInstanceOf(observer, Model)) {
      const subscription = {
        start: () => {
          observer.watch('*', this.dispatch, true)
          observer.watch('!', this.dispatch)
        },
        stop: () => {
          observer.unwatch('*', this.dispatch)
          observer.unwatch('!', this.dispatch)
        },
        observer,
      }
      this.observers.push(subscription)
    }
    else if (isFunction(observer)) {
      let unsubscribe = null
      const subscription = {
        start: () => {
          unsubscribe = observer(this.dispatch)
        },
        stop: () => {
          if (isFunction(unsubscribe)) {
            unsubscribe(this.dispatch)
            unsubscribe = null
          }
        },
        observer,
      }
      this.observers.push(subscription)
    }
    else if (isObject(observer)) {
      const { subscribe, unsubscribe } = observer
      const subscription = {
        start: () => subscribe(this.dispatch),
        stop: () => isFunction(unsubscribe) ? unsubscribe(this.dispatch) : null,
        observer,
      }
      this.observers.push(subscription)
    }
  }
}
