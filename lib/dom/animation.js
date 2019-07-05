import Transform from '../animation/transform.js'
import { isNumber, isArray, each } from '../core/utils.js'

Object.assign(Transform.prototype, {
  get() {
    const rules = this.rules
    const convert = v => isNumber(v) ? parseInt(v, 10) + 'px' : v
    let text = ''
    each(rules, (value, key) => {
      const v = isArray(value) ? value.map(convert).join(', ') : convert(value)
      text += `${key}(${v}) `
    })
    return text
  }
})