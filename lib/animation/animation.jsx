import Component from '../core/component.js'
import { noop, isNumeric } from '../core/utils.js'
import Section from '../components/section.jsx'
import Transition from './transition.js'
import tween from './tween.js'
import Transform from '../style/transform.js'

export class Animation extends Component {
  static props = {
    show: Boolean,

    enter: String,
    leave: String,
  }

  static defaultProps = {
    show: false,

    enter: 'linear 0',
    leave: 'linear 0',

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
    const { enter, leave } = this.attrs

    const enterTypes = []
    const enterOption = {}
    enter.split(' ').filter(item => !!item).forEach((item) => {
      if (item.indexOf(':') > 0) {
        enterTypes.push(item)
      }
      else if (isNumeric(item)) {
        enterOption.duration = +item
      }
      else {
        enterOption.ease = item
      }
    })

    const leaveTypes = []
    const leaveOption = {}
    leave.split(' ').filter(item => !!item).forEach((item) => {
      if (item.indexOf(':') > 0) {
        leaveTypes.push(item)
      }
      else if (isNumeric(item)) {
        leaveOption.duration = +item
      }
      else {
        leaveOption.ease = item
      }
    })

    this.transform = new Transform()
    this.enterTransition = new Transition(enterOption)
    this.leaveTransition = new Transition(leaveOption)

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
    let opacity = 1

    if (params === 'in') {
      opacity = tween(0, 1, factor)
    }
    else if (params === 'out') {
      opacity = tween(1, 0, factor)
    }
    else if (params.indexOf('/') > 0) {
      const [from, to] = params.split('/').map(item => +item)
      opacity = tween(from, to, factor)
    }
    else {
      return
    }

    this.setState({
      style: {
        ...this.state.style,
        opacity,
      },
    })
  }
  move(params, factor) {
    const map = (str) => {
      const items = str.split(',').filter(item => !!item)

      if (items.length === 1) {
        items[1] = 0
      }

      return items.map((item) => {
        if (item === 'left') {
          return -100
        }
        else if (item === 'right') {
          return 100
        }
        else if (item === 'top') {
          return -50
        }
        else if (item === 'bottom') {
          return 50
        }
        else {
          return +item || 0
        }
      })
    }
    const [from, to = '0,0'] = params.split('/').filter(item => !!item)
    const [fromX, fromY] = map(from)
    const [toX, toY] = map(to)

    const translateX = tween(fromX, toX, factor)
    const translateY = tween(fromY, toY, factor)

    this.transform.set({ translateX, translateY })

    this.setState({
      style: {
        ...this.state.style,
        transform: this.transform.get(),
      },
    })
  }
  rotate(params, factor) {
    const [from, to = '0deg'] = params.split('/').filter(item => !!item)

    const fromAngle = parseFloat(from)
    const fromUnit = from.substr(fromAngle.toString().length)

    const toAngle = parseFloat(to)
    const toUnit = to.substr(toAngle.toString().length)

    if (fromUnit !== toUnit) {
      return
    }

    const value = tween(fromAngle, toAngle, factor)
    const rotate = value + toUnit

    this.transform.set({ rotate })

    this.setState({
      style: {
        ...this.state.style,
        transform: this.transform.get(),
      },
    })
  }
  scale(params, factor) {
    const [from, to = '1'] = params.split('/').filter(item => !!item)
    const scale = tween(+from, +to, factor) + ''

    this.transform.set({ scale })

    this.setState({
      style: {
        ...this.state.style,
        transform: this.transform.get(),
      },
    })
  }

  toggle() {
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

  onUpdated() {
    this.toggle()
  }

  onMounted() {
    this.toggle()
  }

  onUnmount() {
    this.enterTransition.stop()
    this.leaveTransition.stop()
  }

  render() {
    const { show, style } = this.state
    const { ease, duration, component, ...rest } = this.attrs
    delete rest.show

    const C = component ? component : Section
    const stylesheet = [this.style, this.className]

    if (show) {
      stylesheet.push(style)
    }

    return show ? <C {...rest} stylesheet={stylesheet}>{this.children}</C> : null
  }
}

export default Animation
