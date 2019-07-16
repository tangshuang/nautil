import Component from '../core/component.js'

export class Observer extends Component {
  static props = {
    subscribe: Function,
    unsubscribe: Function,
    dispatch: Function,
  }
  onMounted() {
    const { subscribe, dispatch } = this.props
    subscribe(dispatch)
  }
  onUnmount() {
    const { unsubscribe, dispatch } = this.props
    unsubscribe(dispatch)
  }
  render() {
    return this.props.children
  }
}
export default Observer

export function observe(subscribe, unsubscribe) {
  return function(C) {
    return class extends Component {
      render() {
        return (
          <Observer subscribe={subscribe} unsubscribe={unsubscribe} dispatch={this.update}>
            <C {...this.props} />
          </Observer>
        )
      }
    }
  }
}

export function pipe(observers) {
  const items = [...observers]
  items.reverse()
  return function(Component) {
    return items.reduce((C, observe) => observe(C), Component)
  }
}
