import React from 'react'
import { Subject } from 'rxjs'
import {
  Ty,
  Rule,
  ifexist,
  Store,
  Model,
} from 'tyshemo'
import {
  each,
  map,
  isInstanceOf,
  makeKeyChain,
  clone,
  assign,
  createProxy,
  isObject,
  isFunction,
  isBoolean,
  isArray,
  isSymbol,
} from 'ts-fns'

import Style from './style/style.js'
import ClassName from './style/classname.js'
import {
  Binding,
  Handling,
} from './types.js'

/**
 * noop
 */
export function noop() {}

export function buildAttrs(props, Component) {
  const { props: PropsTypes } = Component
  const { children, stylesheet, style, className, ...attrs } = props

  /**
   * Prepare for data type checking and attrs real context
   */
  const finalAttrs = {}
  const finalTypes = {}

  // two-way binding:
  const bindingAttrs = {}
  const bindingTypes = {}

  // prepare for data type checking
  if (process.env.NODE_ENV !== 'production') {
    if (PropsTypes) {
      const propTypes = { ...PropsTypes }
      each(propTypes, (type, key) => {
        if (/^\$[a-zA-Z]/.test(key)) {
          const attr = key.substr(1)
          finalTypes[attr] = type
          bindingTypes[key] = isInstanceOf(type, Rule) && type.name === 'ifexist' ? ifexist(Binding) : Binding
        }
        else if (!/^on[A-Z]/.test(key)) {
          finalTypes[key] = type
        }
      })
    }
  }

  // prepare for attrs data
  each(attrs, (data, key) => {
    if (/^\$[a-zA-Z]/.test(key)) {
      const attr = key.substr(1)

      // simple way to use two-way binding, use store or model directly
      if (isInstanceOf(data, Store)) {
        const { state } = data
        data = [state[attr], v => state[attr] = v]
      }
      else if (isInstanceOf(data, Model)) {
        data = [data[attr], v => data[attr] = v]
      }

      // not a required prop, check its data type with Binding
      if (process.env.NODE_ENV !== 'production') {
        if (!bindingTypes[key]) {
          bindingTypes[key] = Binding
        }
      }

      bindingAttrs[key] = data
      finalAttrs[attr] = data[0] // $show={[value, update]} => finalAttrs[show]=value
    }
    else if (!/^on[A-Z]/.test(key)) {
      finalAttrs[key] = data
    }
  })

  // check data type now
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(bindingAttrs).to.match(bindingTypes)
    Ty.expect(finalAttrs).to.match(finalTypes)
  }

  // create two-way binding props
  const state = createProxy(finalAttrs, {
    writable(keyPath, value) {
      const chain = isArray(keyPath) ? [...keyPath] : makeKeyChain(keyPath)
      const root = chain.shift()
      const bindKey = '$' + root
      const bindData = bindingAttrs[bindKey]
      if (bindData) {
        const [current, update] = bindData
        if (chain.length) {
          const next = clone(current)
          assign(next, chain, value)
          update(next, current)
        }
        else {
          update(value, current)
        }
      }
      return false
    },
  })

  return state
}

export function buildStreams(props, Component, callback) {
  const { props: PropsTypes } = Component
  const { children, stylesheet, style, className, ...attrs } = props

  /**
   * Prepare for data type checking and attrs real context
   */
  // handlers
  const handlingAttrs = {}
  const handlingTypes = {}

  // prepare for data type checking
  if (process.env.NODE_ENV !== 'production') {
    if (PropsTypes) {
      const propTypes = { ...PropsTypes }
      each(propTypes, (type, key) => {
        if (/^on[A-Z]/.test(key)) {
          handlingTypes[key] = isInstanceOf(type, Rule) && type.name === 'ifexist' ? ifexist(Handling) : Handling
        }
      })
    }
  }

  // prepare for streams
  each(attrs, (value, key) => {
    if (/^on[A-Z]/.test(key)) {
      // for type checking
      if (process.env.NODE_ENV !== 'production') {
        if (!handlingTypes[key]) {
          handlingTypes[key] = Handling
        }
      }

      handlingAttrs[key] = value
      delete attrs[key]
    }
  })

  // check data type now
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(handlingAttrs).to.match(handlingTypes)
  }


  /**
   * use the passed handler like onClick to create a stream
   * @param {*} param
   */
  function createHandledStream(param, key) {
    let subject = new Subject()

    const args = isArray(param) ? [...param] : [param]
    const subscribe = args.pop()

    // inner bind come first
    if (isFunction(callback)) {
      subject = callback(subject, key)
    }

    // outer pass args come later
    if (args.length) {
      subject = subject.pipe(...args)
    }

    if (isFunction(subscribe)) {
      subject.subscribe(subscribe)
    }

    return subject
  }

  const streams = map(handlingAttrs, createHandledStream)
  return streams
}

export function buildClassName(props, Component) {
  const { defaultStylesheet } = Component
  const { stylesheet, className } = props

  /**
   * Format stylesheet by using stylesheet, className, style props
   */
  const stylequeue = [].concat(defaultStylesheet).concat(stylesheet).concat(className)
  const _className = ClassName.create(stylequeue)
  return _className
}

export function buildStyle(props, Component) {
  const { defaultStylesheet } = Component
  const { stylesheet, style } = props

  /**
   * Format stylesheet by using stylesheet, className, style props
   */
  const stylequeue = [].concat(defaultStylesheet).concat(stylesheet).concat(style)
  const _style = Style.create(stylequeue)
  return _style
}

/**
 * create a two-way-bind value:
 * pass:
 *   <Some $value={[state.value, value => state.value = value]} />
 * now:
 *   const $state = createTwoWayBinding(state)
 *   <Some $value={$state.value} />
 * @param {*} data
 * @param {*} update
 */
export function createTwoWayBinding(data, update) {
  const createReflect = (data, keyPath) => {
    return (v) => {
      // use passed update
      if (isFunction(update)) {
        update(data, keyPath, v)
      }
      // update data directly
      else {
        assign(data, keyPath, v)
      }
    }
  }
  const proxy = createProxy(data, {
    get({ keyPath }) {
      const update = createReflect(data, keyPath)
      return [value, update]
    },
    set({ keyPath }) {
      const update = createReflect(data, keyPath)
      update(value)
    },
    del({ keyPath }) {
      // use passed update
      if (isFunction(update)) {
        update(data, keyPath)
      }
      // update data directly
      else {
        remove(data, keyPath)
      }
    },
  })
  return proxy
}

// ------------------------------------

/**
 * objects absolute equal, use === to detect
 * @param {*} obj1
 * @param {*} obj2
 */
// export function isObjectsAbsolutelyEqual(obj1, obj2) {
//   if (!isObject(obj1) || !isObject(obj2)) {
//     return obj1 === obj2
//   }
//   if (Object.keys(obj1).length == 0 && Object.keys(obj2).length === 0) {
//     return true
//   }
//   return obj1 === obj2
// }

// export function filterChildren(children, iterator) {
//   if (!iterator) {
//     iterator = item => item !== null && item !== undefined && !isBoolean(item) && item
//   }
//   const output = React.Children.toArray(children).filter(iterator)
//   return output
// }

// export function mapChildren(children, iterator) {
//   children = React.Children.map(children, iterator)
//   return children
// }

export function createPlaceholderComponent(placeholder) {
  if (isFunction(placeholder)) {
    return placeholder()
  }
  else {
    return placeholder || null
  }
}

// export function attachPrototype(Target, protos) {
//   Object.assign(Target.prototype, protos)
//   return Target
// }

// export function attachPrototypeEntry(Target, props) {
//   Object.assign(Target.prototype, map(props, (value, key) => {
//     const original = Target.prototype[key]
//     return function(...args) {
//       // results should be an array
//       const results = value.apply(this, args)
//       const output = isFunction(original) ? original.apply(this, results) : results
//       return output
//     }
//   }))
//   return Target
// }

// export function attachPrototypeOutput(Target, props) {
//   Object.assign(Target.prototype, map(props, (value, key) => {
//     const original = Target.prototype[key]
//     return function(...args) {
//       const results = original.apply(this, args)
//       const output = value.apply(this, results)
//       return output
//     }
//   }))
//   return Target
// }

// export function attachStatic(Target, props) {
//   Object.assign(Target, props)
//   return Target
// }

// export function attachShadowClass(TargetClass, ShadowClass) {
//   Object.setPrototypeOf(TargetClass, ShadowClass)
//   Object.setPrototypeOf(TargetClass.prototype, ShadowClass.prototype)
//   return TargetClass
// }
