import { isNumber, isArray, each, mixin } from 'ts-fns'
import Transform from '../../lib/style/transform.js'

mixin(Transform, class {
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

export { Transform }
export default Transform
