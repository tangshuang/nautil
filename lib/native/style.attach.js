import Transform from '../style/transform.js'
import { each } from '../core/utils.js'
import Component from '../core/component.js'
import { StyleSheet } from 'react-native'

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

Object.assign(Component.prototype, {
  _generateStyle(rules) {
    const styles = super._generateStyle(rules)
    const sheet = StyleSheet.create({ styles })
    return sheet.styles
  },
})
