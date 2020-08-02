import Transform from '../style/transform.js'
import { isNumber, isArray, each, attachPrototype } from '../utils.js'

attachPrototype(Transform, {
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
