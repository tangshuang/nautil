import { map, isFunction, isBoolean, isString, mixin } from 'ts-fns'
import Style from '../../lib/style/style.js'
import { StyleSheet } from 'react-native'

const { create } = Style

mixin(Style, class {
  static ensure(styles, iterate) {
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
  static create(stylesheet) {
    const rules = create(stylesheet)
    const styles = StyleSheet.create({ rules })
    return styles.rules
  }
})

export { Style }
export default Style
