import Transfrom from './transform.js'
import {
  each,
  isObject,
  isBoolean,
  isFunction,
  isNumeric,
  isNumber,
} from 'ts-fns'

export class Style {
  /**
   * @param {array} stylesheet
   */
  static make(stylesheet) {
    const style = {}

    stylesheet.forEach((item) => {
      if (isObject(item)) {
        each(item, (value, key) => {
          if (!isBoolean(value)) {
            style[key] = value
          }
        })
      }
    })

    return style
  }

  /**
   * @param {object} style
   * @param {function} iterate
   */
  static ensure(style, iterate) {
    // will be override in react-native
    const rules = {}
    each(style, (value, key) => {
      if (!Style.filter(key, value)) {
        return
      }
      if (isFunction(iterate)) {
        rules[key] = iterate(value, key)
      }
      else if (key === 'transform' && !isBoolean(value)) {
        const rule = Transfrom.convert(value)
        rules[key] = rule
      }
      else {
        rules[key] = Style.convert(value)
      }
    })
    return rules
  }

  static filter(key, value) {
    return true
  }

  static convert(value, key) {
    return value
  }

  /**
   * @param {*} stylesheet
   */
  static create(stylesheet) {
    const stylequeue = [].concat(stylesheet)
    const style = Style.make(stylequeue)
    const rules = Style.ensure(style)
    return rules
  }

  static stringify(rules) {
    const keys = Object.keys(rules)
    let str = ''

    keys.forEach((key) => {
      const rule = rules[key]
      const name = key.replace(/[A-Z]/, (matched) => {
        return '-' + matched.toLocaleLowerCase()
      })
      const value = isNumber(rule) || isNumeric(rule) ? rule + 'px' : rule
      str += `${name}: ${value}`
    })

    return str
  }
}
export default Style
