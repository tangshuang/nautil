import Transfrom from './transform'
import {
  each, map,
  isObject,
  isBoolean,
  isFunction,
} from '../core/utils'

export class Style {
  static make(stylesheet) {
    const styles = {}
    const patchStylesheetObject = (style = {}) => {
      each(style, (value, key) => {
        if (!isBoolean(value)) {
          styles[key] = value
        }
      })
    }

    stylesheet.forEach((item) => {
      if (isObject(item)) {
        patchStylesheetObject(item)
      }
    })

    return styles
  }
  static ensure(styles, iterate) {
    // will be override in react-native
    const rules = map(styles, (value, key) => {
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
}

export default Style
