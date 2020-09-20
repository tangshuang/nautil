import { each, mixin } from 'ts-fns'
import Transform from '../../lib/core/style/transform.js'

mixin(Transform, class {
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

export { Transform }
export default Transform
