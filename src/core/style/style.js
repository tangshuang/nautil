import Transfrom from './transform.js'
import {
  each,
  map,
  isObject,
  isBoolean,
  isFunction,
} from 'ts-fns'

export const StyleService = {
  /**
   * @param {array} stylesheet
   */
  make(stylesheet) {
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
  },

  /**
   * @param {object} style
   * @param {function} iterate
   */
  ensure(style, iterate) {
    // will be override in react-native
    const rules = map(style, (value, key) => {
      if (key === 'transform' && !isBoolean(value)) {
        const rule = Transfrom.convert(value)
        return rule
      }
      else if (isFunction(iterate)) {
        return iterate(value, key)
      }
      else {
        return value
      }
    })
    return rules
  },

  /**
   * @param {*} stylesheet
   */
  create(stylesheet) {
    const stylequeue = [].concat(stylesheet)
    const style = StyleService.make(stylequeue)
    const rules = StyleService.ensure(style)
    return rules
  },
}

export default StyleService
