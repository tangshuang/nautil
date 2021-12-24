import { ifexist, Any } from 'tyshemo'
import { isFunction } from 'ts-fns'

import Component from '../component.js'
import Navigation from './navigation.js'

import { Observer } from '../components/observer.jsx'
import { Consumer } from './context.js'
import { decorate } from '../operators/operators.js'

class _Route extends Component {
  static props = {
    navigation: Navigation,
    match: Any,
    exact: ifexist(Boolean),
    animation: ifexist(Number),
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      display: false,
    }
    this._isMounted = false
  }

  toggle() {
    const { navigation, match, exact, animation } = this.attrs
    const matched = navigation.is(match, exact)
    const { show, display } = this.state
    if (animation) {
      if (matched && !display) {
        clearTimeout(this._timer)
        this.setState({ display: true, show: false })
        this._timer = setTimeout(() => this.setState({ show: true }), 10)
      }
      else if (!matched && show) {
        clearTimeout(this._timer)
        this.setState({ show: false })
        this._timer = setTimeout(() => this.setState({ display: false }), animation)
      }
    }
    else {
      if (matched && !display) {
        this.setState({ display: true, show: true })
      }
      else if (!matched && show) {
        this.setState({ display: false, show: false })
      }
    }
  }
  onMounted() {
    this._isMounted = true
    this.toggle()
  }
  onUpdated() {
    this.toggle()
  }
  onUnmount() {
    this._isMounted = false
    clearTimeout(this._timer)
  }

  render() {
    const { navigation, component, props = {}, match, exact } = this.attrs
    return (
      <Observer subscribe={dispatch => navigation.on('$change', dispatch)} unsubscribe={dispatch => navigation.off('$change', dispatch)} dispatch={this.weakUpdate}>
        {() => {
          const { show, display } = this.state
          const matched = navigation.is(match, exact)

          // in SSR, the first time render should not use sync-render
          if (this._isMounted) {
            if (!display) {
              return null
            }
          }
          else if (!matched) {
            return null
          }

          const children = this.children
          if (component) {
            const RouteComponent = component
            return <RouteComponent show={show} {...props}>{children}</RouteComponent>
          }
          else if (isFunction(this.children)) {
            return this.children({ navigation: navigation, show })
          }
          else if (children) {
            return children
          }
          else {
            const { route } = navigation.state
            const { component: RouteComponent, props = {} } = route
            return RouteComponent ? <RouteComponent navigation={navigation} show={show} {...props} /> : null
          }
        }}
      </Observer>
    )
  }
}

export const Route = decorate(Consumer, ['navigation'])(_Route)
export default Route
