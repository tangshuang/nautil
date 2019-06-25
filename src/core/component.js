import React from 'react'
import {
  makeKeyChainByPath,
  createProxy,
  each,
} from './utils'

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    var isSetingState = false
    const setState = this.setState.bind(this)
    Object.defineProperty(this, 'setState', {
      enumerable: false,
      configurable: false,
      value: (...args) => {
        isSetingState = true
        setState(...args)
        isSetingState = false
      },
    })

    var state = createState({})
    const createState = (v) => {
      return createProxy(v, {
        set: (keyPath, value, key, target) => {
          if (isSetingState) {
            return
          }
          const chain = makeKeyChainByPath(keyPath)
          const root = chain[0]
          if (keyPath === root) {
            setState({
              [root]: value,
            })
          }
          else {
            const current = state[root]

            target[key] = value
            setState({
              [root]: { ...current },
            })
          }
        },
        get: () => {},
        del: (keyPath, key, target) => {
          if (target === state) {
            throw new Error('[nautil component]: state property should not be deleted.')
          }
          if (isSetingState) {
            return
          }
          const chain = makeKeyChainByPath(keyPath)
          const root = chain[0]
          const current = state[root]

          delete target[key]
          setState({
            [root]: { ...current },
          })
        },
      })
    }
    Object.defineProperty(this, 'state', {
      enumerable: false,
      configurable: false,
      get: () => {
        return state
      },
      set: (v) => {
        if (!isObject(v)) {
          throw new Error('[nautil component]: state should be an object.')
        }
        state = createState(v)
        return true
      },
    })

    var props = { ...this.props }
    const modify = (props) => {
      each(props, (value, key) => {
        if (key.indexOf('$') === 0) {
          delete props[key]
          const attr = key.substr(1)
          this[attr] = value
        }
      })

      this.children = props.children
      delete props.children
    }
    modify(props)
    Object.defineProperty(this, 'props', {
      enumerable: false,
      configurable: false,
      get: () => props,
      set: (v) => {
        const p = { ...v }
        modify(p)
        props = p
      },
    })
  }
}
