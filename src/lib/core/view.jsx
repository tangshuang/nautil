import { memo } from 'react'
import { Store } from '../store/store.js'
import { each, getConstructorOf, isInheritedOf, isFunction, isInstanceOf, isObject, throttle } from 'ts-fns'
import Component from './component.js'
import { Stream } from './stream.js'
import { evolve } from '../operators/operators.js'
import { SingleInstanceBase } from '../utils.js'
import { Controller } from './controller.js'

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
export class View extends SingleInstanceBase {
  constructor() {
    super()

    this.observers = []
    this.emitters = []

    this.update = throttle(() => {
      this.emitters.forEach(({ component }) => component.weakUpdate())
      this.onUpdate()
    }, 16)

    const queue = []
    const run = throttle(() => {
      const components = emitters.filter(({ component }) => queue.includes(component)).map(({ component }) => component)
      if (components.length) {
        components.forEach((component) => component.weakUpdate())
      }
      this.onUpdate()
      queue.length = 0 // clear the queue
    }, 16)
    this.updateOnly = (component) => {
      queue.push(component)
      run()
    }

    let activeCount = 0
    this.active = () => {
      if (!activeCount) {
        this.onStart()
      }
      activeCount ++
    }
    this.inactive = () => {
      activeCount --
      if (!activeCount) {
        this.destroy()
        this.onEnd()
      }
    }

    const Constructor = getConstructorOf(this)
    const streams = []
    each(Constructor, (Item, key) => {
      if (Item && (Item === Store || isInheritedOf(Item, Store))) {
        this[key] = new Item()
        this.observers.push(this[key])
      }
      else if (Item && isInheritedOf(Item, Controller)) {
        this[key] = new Controller()
        this.observers.push(this[key])
      }
      else if (isFunction(Item) && key[key.length - 1] === '$') {
        const stream$ = new Stream()
        this[key] = stream$
        streams.push([Item, stream$])
      }
      else if (isFunction(Item) || isInstanceOf(Item, Component)) {
        const charCode = key.charCodeAt(0)
        // if not uppercase, make it as a method
        if (charCode >= 65 && charCode <= 90) {
          const Gen = isInstanceOf(Item, Component) ? Item : memo(Item.bind(this))
          this[key] = this.reactive(Gen)
        }
      }
    })
    // register all streams at last, so that you can call this.stream$ directly in each function.
    streams.forEach(([fn, stream$]) => fn.call(this, stream$))

    each(this, (value, key) => {
      if (isObject(value) && value.$$type === 'reactive' && value.component) {
        this[key] = this.reactive(value.component, typeof value.collect === 'function' ? value.collect.bind(this) : null)
      }
    })

    // developers should must extends Controller and overwrite `init` method to initailize
    this.init()
  }

  init() {}

  /**
   *
   * @param {*} component
   * @param {function|array} collect
   * function: collect passed into evovle;
   * array: data sources which to subscribe;
   * @returns
   * @example
   *
   * this.controller.reactive(
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

    const view = this
    class G extends Component {
      onMounted() {
        view.watch(this)
      }
      onUnmount() {
        view.unwatch(this)
      }
      render() {
        const attrs = { ...this.props }
        delete attrs.stylesheet
        return <E {...attrs} className={this.className} style={this.style} />
      }
    }

    return G
  }

  watch(component) {
    const dispatch = () => this.updateOnly(component)
    this.emitters.push({
      component,
      dispatch,
    })
    this.observers.forEach((observer) => {
      observer.subscribe(dispatch)
    })
  }

  unwatch(component) {
    this.emitters.forEach(({ component: c, dispatch }, i) => {
      if (component !== c) {
        return
      }

      this.observers.forEach((observer) => {
        observer.unsubscribe(dispatch)
      })

      // delete this emitter
      this.emitters.splice(i, 1)
    })
  }

  onStart() {}
  onUpdate() {}
  onEnd() {}
}
