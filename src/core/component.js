import React from 'react'
import { each } from './utils'

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

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
