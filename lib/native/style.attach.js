import Style from '../style/style.js'
import Transform from '../style/transform.js'
import { each, attachPrototype, attachStatic } from '../core/utils.js'

attachStatic(Style, {
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

attachPrototype(Transform, {
  get() {
    const rules = this.rules
    let arr = []
    each(rules, (value, key) => {
      if (key === 'translate' || key === 'skew') {
        const [x, y] = value
        const xitem = { [key + 'X']: x }
        const yitem = { [key + 'Y']: y }
        arr.push(xitem, yitem)
      }
      else {
        const item = { [key]: value }
        arr.push(item)
      }
    })
    return arr
  }
})
