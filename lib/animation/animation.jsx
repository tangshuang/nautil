import Component from '../core/component.js'
import { noop } from '../core/utils.js'
import Section from './section.jsx'
import { Transition, tween } from './transition.js'

export class Animation extends Component {
  static validateProps = {
    duration: Number,
    ease: String,

    enter: String,
    leave: String,
    show: Boolean,

    onStart: Function,
    onDuring: Function,
    onEnd: Function,
  }

  static defaultProps = {
    ease: 'linear',
    duration: 0.5,
    show: false,

    onStart: noop,
    onDuring: noop,
    onStop: noop,
  }

  state = {
    show: false,
    style: {},
  }

  create() {
    const { ease, duration } = this.attrs
    this.transition = new Transition({ ease, duration })
  }

  listen() {
    const { enter, leave, show } = this.attrs
    const enterTypes = enter.split(' ')
    const leaveTypes = leave.split(' ')
    const types = show ? enterTypes : leaveTypes

    this.transition.on('update', () => {
      types.forEach((ease) => {
        if (!ease) {
          return
        }

        const [method, params] = ease.split(':')
        if (this[method]) {
          this[method](params)
        }
      })
      this.onUpdate$.next()
    })
    this.transition.on('start', () => {
      this.setState({ show: true })
      this.onStart$.next()
    })
    this.transition.on('stop', () => {
      this.setState({ show: false })
      this.onStop$.next()
    })
  }

  fade(params) {
    const factor = this.transition.current
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
  moveto(params) {
    const factor = this.transition.current
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

    this.setState({
      style: {
        ...this.state.style,
        transform: [
          ...(this.state.style.transform || []).filter(item => item.translateX === undefined && item.translateY === undefined),
          { translateX },
          { translateY },
        ],
      },
    })
  }
  rotate(params) {
    const factor = this.transition.current
    const num = parseFloat(params)
    const unit = params.substr(num.toString().length)
    const value = tween(0, num, factor)
    const rotate = value + unit

    this.setState({
      style: {
        ...this.state.style,
        transform: [
          ...(this.state.style.transform || []).filter(item => item.rotate === undefined),
          { rotate },
        ],
      },
    })
  }
  scale(params) {
    const factor = this.transition.current
    const scale = tween(params, 1, factor)

    this.setState({
      style: {
        ...this.state.style,
        transform: [
          ...(this.state.style.transform || []).filter(item => item.scale === undefined),
          { scale },
        ],
      },
    })
  }

  updated() {
    const { show } = this.attrs
    if (show && !this.state.show) {
      this.create()
      this.listen()
      this.transition.start()
    }
    else if (!show && this.state.show) {
      this.transition.stop()
      this.create()
      this.listen()
      this.transition.start()
    }
  }

  render() {
    const { show, style } = this.state
    const { ease, duration, ...props } = this.attrs
    delete props.show

    return (show ? <Section style={{ ...this.style, ...style }} {...props}>{this.children}</Section> : null)
  }
}

export default Animation
