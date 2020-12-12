import { map, isFunction, isBoolean, isString, mixin } from 'ts-fns'
import Style from '../../lib/style/style.js'

mixin(Style, class {
  ensure(styles, iterate) {
    // will be override in react-native
    const rules = map(styles, (value, key) => {
      if (isFunction(iterate)) {
        return iterate(value, key)
      }
      else if (key === 'transform' && !isBoolean(value)) {
        const rule = Transfrom.convert(value)
        return rule
      }
      else if (key === 'fontSize') {
        if (isString(value) && value.indexOf('rem') > 0) {
          const size = parseInt(value, 10)
          return PixelRatio.get() <= 2 ? 14 * size : 18 * size
        }
        else {
          return value
        }
      }
      else {
        return value
      }
    })
    return rules
  }
})

export { Style }
export default Style
