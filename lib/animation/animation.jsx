import Component from '../core/component.js'
import { noop } from '../core/utils.js'
import Section from '../components/section.jsx'
import { Transition } from './transition.js'
import { tween } from './tween.js'
import Transform from './transform.js'

export class Animation extends Component {
  static props = {
    duration: Number,
    ease: String,

    enter: String,
    leave: String,
    show: Boolean,

    onEnterStart: Function,
    onEnterUpdate: Function,
    onEnterStop: Function,

    onLeaveStart: Function,
    onLeaveUpdate: Function,
    onLeaveStop: Function,
  }

  static defaultProps = {
    ease: 'linear',
    duration: 0.5,

    enter: '',
    leave: '',

    show: false,

    onEnterStart: noop,
    onEnterUpdate: noop,
    onEnterStop: noop,

    onLeaveStart: noop,
    onLeaveUpdate: noop,
    onLeaveStop: noop,
  }

  state = {
    show: false,
    style: {},
  }

  onInit() {
    const { enter, leave, ease, duration } = this.attrs
    const enterTypes = enter.split(' ')
    const leaveTypes = leave.split(' ')

    this.transform = new Transform()
    this.enterTransition = new Transition({ ease, duration })
    this.leaveTransition = new Transition({ ease, duration })

    const update = (transition, types) => {
      types.forEach((type) => {
        if (!type) {
          return
        }

        const [method, params] = type.split(':')
        if (this[method]) {
          const factor = transition.current
          this[method](params, factor)
        }
      })
    }

    this.enterTransition.on('start', () => {
      this.setState({ show: true })
      this.onEnterStart$.next()
    })
    this.enterTransition.on('update', () => {
      update(this.enterTransition, enterTypes)
      this.onEnterUpdate$.next()
    })
    this.enterTransition.on('stop', () => {
      this.onEnterStop$.next()
    })

    this.leaveTransition.on('start', () => {
      this.onLeaveStart$.next()
    })
    this.leaveTransition.on('update', () => {
      update(this.leaveTransition, leaveTypes)
      this.onLeaveUpdate$.next()
    })
    this.leaveTransition.on('stop', () => {
      this.setState({ show: false })
      this.onLeaveStop$.next()
    })
  }

  fade(params, factor) {
    const opacity = params === 'in' ? tween(0, 1, factor) : params === 'out' ? tween(1, 0, factor) : undefined

    if (opacity === undefined) {
      return
    }

    this.setState({
      style: {
        ...this.state.style,
        opacity,
      },
    })
  }
  moveto(params, factor) {
    const direction = params.split('-')

    let translateX = 0
    if (direction.indexOf('left') > -1) {
      translateX = tween(100, 0, factor)
    }
    else if (direction.indexOf('right') > -1) {
      translateX = tween(0, 100, factor)
    }

    let translateY = 0
    if (direction.indexOf('top') > -1) {
      translateY = tween(50, 0, factor)
    }
    else if (direction.indexOf('bottom') > -1) {
      translateY = tween(0, 50, factor)
    }

    this.transform.set({ translateX, translateY })

    this.setState({
      style: {
        ...this.state.style,
        transform: this.transform.get(),
      },
    })
  }
  rotate(params, factor) {
    const num = parseFloat(params)
    const unit = params.substr(num.toString().length)
    const value = tween(0, num, factor)
    const rotate = value + unit

    this.transform.set({ rotate })

    this.setState({
      style: {
        ...this.state.style,
        transform: this.transform.get(),
      },
    })
  }
  scale(params, factor) {
    const scale = tween(params, 1, factor)

    this.transform.set({ scale })

    this.setState({
      style: {
        ...this.state.style,
        transform: this.transform.get(),
      },
    })
  }

  onUpdated() {
    // `show` is what visibale state want to be next
    // `state` is current visible state
    const { show } = this.attrs
    const state = this.state.show

    if (show && !state) {
      this.enterTransition.start()
    }
    else if (!show && state) {
      this.leaveTransition.start()
    }
  }

  render() {
    const { show, style } = this.state
    const { ease, duration, component, ...props } = this.attrs
    delete props.show

    const Component = component ? component : Section

    return (show ? <Component style={{ ...this.style, ...style }} {...props}>{this.children}</Component> : null)
  }
}

export default Animation
