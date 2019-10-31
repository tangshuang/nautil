import Transform from '../style/transform.js'
import { each, isString } from '../core/utils.js'
import Component from '../core/component.js'
import { StyleSheet, PixelRatio } from 'react-native'

Object.assign(Transform.prototype, {
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

const _generateStyle = Component.prototype._generateStyle
Object.assign(Component.prototype, {
  _generateStyle(rules) {
    const styles = _generateStyle.call(this, rules, (value, key) => {
      if (key === 'fontSize') {
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

    const sheet = StyleSheet.create({ styles })
    return sheet.styles
  },
})
