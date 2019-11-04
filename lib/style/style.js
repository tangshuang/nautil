import Transfrom from './transform'
import {
  each, map,
  isObject,
  isBoolean,
  isFunction,
} from '../core/utils'

export class Style {
  /**
   * @param {array} stylesheet
   */
  static make(stylesheet) {
    const style = {}
    const patchStylesheetObject = (style = {}) => {
      each(style, (value, key) => {
        if (!isBoolean(value)) {
          style[key] = value
        }
      })
    }

    stylesheet.forEach((item) => {
      if (isObject(item)) {
        patchStylesheetObject(item)
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
}

export default Style