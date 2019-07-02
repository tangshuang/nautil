import Component from '../core/component.js'
import { noop, groupArray } from '../core/utils.js'
import Section from './section.js'
import Etx from 'etx'

export class Animation extends Component {
  static validateProps = {
    duration: Number,
    loop: Number,
    type: String,

    enter: String,
    leave: String,
    show: Boolean,

    onStart: Function,
    onDuring: Function,
    onEnd: Function,
  }

  static defaultProps = {
    type: 'linear',
    duration: 0.5,
    loop: false,
    show: false,

    onStart: noop,
    onUpdate: noop,
    onStop: noop,
  }

  state = {
    show: false,
    style: {},
  }

  create() {
    const { type, duration, loop } = this.attrs
    this.transition = new Transition({ type, duration, loop })
  }

  listen() {
    const { enter, leave, show } = this.attrs
    const enterTypes = enter.split(' ')
    const leaveTypes = leave.split(' ')
    const types = show ? enterTypes : leaveTypes

    this.transition.on('update', () => {
      types.forEach((type) => {
        if (!type) {
          return
        }

        const [method, params] = type.split(':')
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
    const opacity = params === 'in' ? Transition.tween(0, 1, factor) : params === 'out' ? Transition.tween(1, 0, factor) : undefined

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
      translateX = Transition.tween(100, 0, factor)
    }
    else if (direction.indexOf('right') > -1) {
      translateX = Transition.tween(0, 100, factor)
    }

    let translateY = 0
    if (direction.indexOf('top') > -1) {
      translateY = Transition.tween(50, 0, factor)
    }
    else if (direction.indexOf('bottom') > -1) {
      translateY = Transition.tween(0, 50, factor)
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
    const value = Transition.tween(0, num, factor)
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
    const scale = Transition.tween(params, 1, factor)

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
    const { type, duration, loop, ...props } = this.attrs
    return <Section style={{ ...this.style, ...style }} {...props}>{show ? this.children : null}</Section>
  }

  static Transition = Transition
}

class Transition extends Etx {
  constructor(options = {}) {
    super()

    const { type = 'linear', start = 0, end = 1, duration = 0, loop = false } = options

    this.type = type
    this.start = start
    this.end = end
    this.duration = duration
    this.loop = loop
    this.current = start

    this.status = -1
    this.time = 0
  }
  animate() {
    if (this.status < 1) {
      return
    }

    const currentTime = Date.now()
    const t = (currentTime - this.time) / this.duration
    const tw = t > 1 ? 1 : t < 0 ? 0 : t
    const easing = Transition.easings[this.type]
    const scale = easing(tw)
    const end = this.end
    const start = this.start
    const value = (end - start) * scale + start
    this.current = value
    this.emit('update', value)

    if (tw === 1 && this.loop) {
      this.time = currentTime
    }
    else if (tw === 1) {
      this.stop()
      return
    }

    requestAnimationFrame(() => {
      this.animate()
    })
  }
  start() {
    if (!easings[this.type] || this.duration <= 0) {
      const value = this.end
      this.current = value
      this.emit('update', value)
      this.stop()
      return
    }

    if (this.status > 0) {
      return
    }
    if (this.status < 0) {
      this.time = Date.now()
    }

    this.status = 1
    this.emit('start')
    this.animate()
  }
  pause() {
    if (this.status <= 0) {
      return
    }

    this.status = 0
    this.emit('pause')
  }
  stop() {
    if (this.status < 0) {
      return
    }

    this.status = -1
    this.emit('stop')
  }

  static tween(start, end, factor) {
    const value = (end - start) * factor + start
    return value
  }

  static tweenColor(start, end, factor) {
    const [sr, sg, sb, sa] = start.indexOf('#') === 0 ? parseHex(start) : parseRgba(start)
    const [er, eg, eb, ea] = end.indexOf('#') === 0 ? parseHex(end) : parseRgba(end)

    const cr = Transition.tween(sr, er, factor)
    const cg = Transition.tween(sg, eg, factor)
    const cb = Transition.tween(sb, eb, factor)
    const ca = sa === undefined && ea === undefined ? undefined : Transition.tween(sa === undefined ? 1 : sa, ea === undefined ? 1 : ea, factor)

    const color = end.indexOf('#') === 0 ? createHex(cr, cg, cb, ca) : createRgba(cr, cg, cb, ca)
    return color
  }
}

// https://gist.github.com/gre/1650294
// https://easings.net/
Transition.easings = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t*t,
  // decelerating to zero velocity
  easeOutQuad: t => t*(2-t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // accelerating from zero velocity
  easeInCubic: t => t*t*t,
  // decelerating to zero velocity
  easeOutCubic: t => (--t)*t*t+1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  // accelerating from zero velocity
  easeInQuart: t => t*t*t*t,
  // decelerating to zero velocity
  easeOutQuart: t => 1-(--t)*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  // accelerating from zero velocity
  easeInQuint: t => t*t*t*t*t,
  // decelerating to zero velocity
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
  // elastic bounce effect at the beginning
  easeInElastic: t => (.04 - .04 / t) * Math.sin(25 * t) + 1,
  // elastic bounce effect at the end
  easeOutElastic: t => .04 * t / (--t) * Math.sin(25 * t),
  // elastic bounce effect at the beginning and end
  easeInOutElastic: t => (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1,
  easeInSin: t => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2),
  easeOutSin: t => Math.sin(Math.PI / 2 * t),
  easeInOutSin: t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
}

function parseRgba(rgba) {
  const values = rgba.split('(')[1].split(')')[0].split(',').map((item, i) => {
    item = item.trim()
    if (item.indexOf('%') > -1 && i < 3) {
      const value = item.substr(0, item.length - 1) / 100 * 255
      return value
    }
    else if (item.indexOf('%') > -1 && i === 3) {
      const value = item.substr(0, item.length - 1) / 100
      return value
    }
    else {
      return +item
    }
  })
  return values
}

function parseHex(hex) {
  const values = hex.substr(1).split('')
  const isSingle = hex.length === 4 || hex.length === 5
  const hexes = isSingle ? values.map(item => item + item) : groupArray(values, 2).map(item => item.join(''))

  const red = +('0x' + hexes[0])
  const green = +('0x' + hexes[1])
  const blue = +('0x' + hexes[2])
  const alpha = hexes[3] ? +((+('0x' + hexes[3]) / 255).toFixed(4)) : undefined

  const results = alpha ? [red, green, blue, alpha] : [red, green, blue]
  return results
}

function createHex(r, g, b, a) {
  const make = (num) => {
    const str = num.toString(16).substr(0, 2)
    const value = str.length === 1 ? '0' + str : str
    return value
  }
  const red = make(r)
  const green = make(g)
  const blue = make(b)
  const alpha = a !== undefined ? make(Math.round(a * 255)) : undefined

  const color = '#' + red + green + blue + (alpha ? alpha : '')
  return color
}

function createRgba(r, g, b, a) {
  const color = (a !== undefined ? 'rgba(' : 'rgb(') + r + ', ' + g + ', ' + b + (a !== undefined ? ', ' + a : '') + ')'
  return color
}

export default Animation
