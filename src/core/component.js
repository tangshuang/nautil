import { Dict } from '../types/index.js'
import DevTool from './devtool.js'
import Store from './store.js'
import { isObject, isArray, clone, isEqual, isEmpty } from '../utils/index.js'

export class Component {
  constructor(props) {
    const TargetComponent = new.target
    const supportedProps = TargetComponent.props
    const defaultState = TargetComponent.state

    const supportedPropKeys = isArray(supportedProps) ? supportedProps : isObject(supportedProps) ? Object.keys(supportedProps) : []

    // 数据类型检查
    if (supportedProps && isObject(supportedProps)) {
      const PropsType = Dict(supportedProps)
      PropsType.trace(props).with((error) => {
        DevTool.error(error)
      })
    }

    const prepareState = clone(defaultState)
    supportedPropKeys.forEach((key) => {
      let value = props[key]
      prepareState[key] = value
    })
    const state = new Store(prepareState)

    // 双向绑定
    supportedPropKeys.forEach((key) => {
      state.$watch(key, ({ newValue, oldValue }) => {
        if (!isEqual(newValue, oldValue)) {
          props.$set(key, newValue)
        }
      }, true)
      props.$watch(key, ({ newValue, oldValue, path }) => {
        if (!isEqual(newValue, oldValue)) {
          state.$set(path, newValue)
        }
      }, true)
    })

    let timer = null
    state.$watch('*', () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.update()
      })
    })

    this.state = state
  }

  render() {
    throw new Error('Component.render should must be override.')
  }

  update(state) {
    if (state) {
      this.state.$silent(true)
      this.state.$update(state)
      this.state.$silent(false)
    }

    const vdom = this.render()
    const patches = this.diff(vdom)
    this.patch(patches)
    this.vdom = vdom
  }

  diff(vdom) {}

  patch(patches) {}

  static h() {}
}

export default Component
