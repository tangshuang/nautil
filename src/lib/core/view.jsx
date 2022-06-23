import { memo, Component as ReactComponent } from 'react'
import { Store } from '../store/store.js'
import { each, getConstructorOf, isInheritedOf, isFunction, isInstanceOf, isObject } from 'ts-fns'
import { Component } from './component.js'
import { Stream } from './stream.js'
import { evolve } from '../decorators/decorators.js'
import { Controller } from './controller.js'
import { Service } from './service.js'
import { DataService } from '../services/data-service.js'
import { Model } from 'tyshemo'
import { PrimitiveBase } from '../utils.js'

/**
 * class SomeView extends View {
 *   controller = new SomeController()
 *
 *   VoteButton(props) {
 *     return <Button onHit={this.controller.vote$}>Vote</Button>
 *   }
 *
 *   VoteCount(props) {
 *     return <Text>{this.controller.vote.count}</Text>
 *   }
 * }
 */
export class View extends Component {
  __init() {
    const components = []
    const observers = []

    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (_, key) => {
      const Item = Constructor[key]
      if (Item && isInheritedOf(Item, DataService)) {
        this[key] = Item.instance()
        // notice that, any data source change will trigger the rerender
        // so you should must pass collect to determine when to rerender, look into example of `reactive`
        observers.push({ observer: this[key] })
      }
      else if (Item && isInheritedOf(Item, Service)) {
        this[key] = Item.instance()
      }
      else if (Item && isInheritedOf(Item, Model)) {
        this[key] = new Item()
        const observer = {
          subscribe: (dispatch) => {
            this[key].watch('*', dispatch, true)
            this[key].watch('!', dispatch, true)
            this[key].on('recover', dispatch)
          },
          unsubscribe: (dispatch) => {
            this[key].unwatch('*', dispatch)
            this[key].unwatch('!', dispatch)
            this[key].off('recover', dispatch)
          },
        }
        observers.push({ observer })
      }
      else if (Item && (Item === Store || isInheritedOf(Item, Store))) {
        this[key] = new Item()
        observers.push({ observer: this[key] })
      }
      else if (Item && isInheritedOf(Item, Controller)) {
        this[key] = Item.instance()
        observers.push({ observer: this[key] })
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([Item, stream$])
      }
      else if (isFunction(Item) || isInstanceOf(Item, ReactComponent)) {
        const charCode = key.charCodeAt(0)
        // if not uppercase, make it as a method
        if (charCode >= 65 && charCode <= 90) {
          const C = isInstanceOf(Item, ReactComponent) ? Item : Item.bind(this)
          components.push([key, C])
        }
      }
    }, true)

    // subscribe to observers
    // should must before components registering
    this.observers = observers

    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([fn, stream$]) => fn.call(this, stream$))

    // register components
    components.forEach(([key, C]) => {
      this[key] = this.reactive(C)
    })

    each(this, (value, key) => {
      if (isObject(value) && value.$$type === 'reactive' && value.component) {
        this[key] = this.reactive(value.component, typeof value.collect === 'function' ? value.collect.bind(this) : null)
      }
    })
  }

  /**
   *
   * @param {*} component
   * @param {function|array} collect
   * function: collect passed into evovle;
   * array: data sources which to subscribe;
   * @returns
   * @example
   *
   * this.reactive(
   *   () => {
   *     const some = this.controller.dataService.get('some')
   *     return <span>{some.name}</span>
   *   },
   *   () => {
   *     const some = this.controller.dataService.get('some')
   *     return [some]
   *   },
   * )
   */
  reactive(component, collect) {
    if (!this.update) {
      return {
        $$type: 'reactive',
        component,
        collect,
      }
    }

    const E = collect ? evolve(collect)(component) : component

    const observers = this.observers
    class G extends Component {
      onMounted() {
        observers.forEach(({ observer }) => {
          if (observer.type === 'this') {
            return
          }
          observer.subscribe(this.weakUpdate)
        })
      }
      onUnmount() {
        observers.forEach(({ observer }) => {
          if (observer.type === 'this') {
            return
          }
          observer.unsubscribe(this.weakUpdate)
        })
      }
      render() {
        const attrs = { ...this.props }
        delete attrs.stylesheet
        return <E {...attrs} className={this.className} style={this.style} />
      }
    }

    return memo(G)
  }

  componentDidMount(...args) {
    this.observers.forEach(({ observer }) => {
      observer.subscribe(this.weakUpdate)
    })
    super.componentDidMount(...args)
  }

  componentWillUnmount(...args) {
    this.observers.forEach(({ observer }) => {
      this.disobserve(observer)
    })
    super.componentWillUnmount(...args)
  }

  /**
   * observe actions only works for current component, not for inner component
   * @param {*} observer
   */
  observe(observer) {
    if (this._isMounted) {
      observer.subscribe(this.weakUpdate)
    }
    if (!this._isUnmounted) {
      this.observers.push({ observer, type: 'this' })
    }
  }

  disobserve(observer) {
    const index = this.observers.findIndex(item => item.observer === observer)
    if (index === -1) {
      return
    }

    observer.unsubscribe(this.weakUpdate)
    // destroy single instances
    if (isInstanceOf(observer, PrimitiveBase)) {
      observer.destructor()
    }
    this.observers.splice(index, 1)
  }
}
