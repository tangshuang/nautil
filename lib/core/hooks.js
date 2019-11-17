
import Store from './store'
import Model from './model'
import Style from '../style/style'
import ClassName from '../style/classname'
import {
  Ty,
  Binding,
  Handling,
  Rule,
  ifexist,
} from './types'
import {
  useState,
  useEffect,
} from 'react'
import {
  each,
  map,
  createHandledStream,
  isInstanceOf,
  createProxy,
  makeKeyChain,
  clone,
  assign,
  noop,
} from '../core/utils'

export {
  userCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

export function useStore(store, key = '*') {
  const { state } = store
  const [v, setState] = useState(null)
  const update = () => setState(+new Date())
  useEffect(() => {
    store.watch(key, update)
    return () => store.unwatch(key, update)
  }, [state])
  return state
}

export function useModel(model, key) {
  return useStore(model, key)
}

export function useDepository(depo, key, params = {}) {
  const value = depo.get(key, params)
  const [v, set] = useState(value)
  const update = (v) => set(v)
  useEffect(() => {
    depo.subscribe(key, update)
    return () => depo.unsubscribe(key, update)
  }, [v])
  const setParams = (params) => depo.request(key, params)
  return [v, setParams]
}

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(value, reflect) {
  if (reflect) {
    return [value, reflect]
  }

  const binding = [].concat(value)
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(binding).to.be(Binding)
  }

  const [v, set = noop] = binding
  return [v, set]
}

export function useAttrs(props, Component = {}) {
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
          bindingTypes[key] = isInstanceOf(type, Rule) && type.name === 'ifexist' ? ifexist(Binding) : Binding
          const attr = key.substr(1)
          finalTypes[attr] = type
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
      if (isInstanceOf(data, Store) || isInstanceOf(data, Model)) {
        const { state } = data
        data = [state[attr], v => state[attr] = v]
      }
      else if (isInstanceOf(data.__store__, Store) || isInstanceOf(data.__model__, Model)) {
        const state = data
        data = [state[attr], v => state[attr] = v]
      }

      // not a required prop, check its data type with Binding
      if (process.env.NODE_ENV !== 'production') {
        if (!bindingTypes[key]) {
          bindingTypes[key] = Binding
        }
      }

      bindingAttrs[key] = data
      finalAttrs[attr] = data[0] // $show={[value, reflect]}
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
    set([obj, keyPath, value]) {
      const root = makeKeyChain(keyPath).shift()
      const bindKey = '$' + root
      const bindData = bindingAttrs[bindKey]
      if (bindData) {
        const reflect = bindData[1]
        const cloned = clone(obj)
        const modifed = assign(cloned, keyPath, value)
        const current = obj[root]
        const next = modifed[root]
        reflect(next, current)
      }
      return false
    },
    del() {
      return false
    },
  })

  return state
}

export function useStreams(props, Component = {}) {
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

  const streams = map(handlingAttrs, (value) => createHandledStream(value))
  return streams
}

export function useClassName(props, Component = {}) {
  const { defaultStylesheet } = Component
  const { stylesheet, className } = props

  /**
   * Format stylesheet by using stylesheet, className, style props
   */
  const stylequeue = [].concat(defaultStylesheet).concat(stylesheet).concat(className)
  const _className = ClassName.create(stylequeue)
  return _className
}

export function useStyle(props, Component = {}) {
  const { defaultStylesheet } = Component
  const { stylesheet, style } = props

  /**
   * Format stylesheet by using stylesheet, className, style props
   */
  const stylequeue = [].concat(defaultStylesheet).concat(stylesheet).concat(style)
  const _style = Style.create(stylequeue)
  return _style
}
