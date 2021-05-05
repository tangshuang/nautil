import { each } from 'ts-fns'
import { Style } from './style.js'

export class Css {
  static getName(key) {
    // camel case
    const items = key.split(/\W|_/).filter(item => !!item).map((item, i) => i > 0 ? item.replace(item[0], item[0].toUpperCase()) : item)
    const name = items.join('')
    return name
  }
  static getRule(rule) {
    return typeof rule === 'object' ? Style.ensure(rule) : rule
  }
  static create(css) {
    if (!css) {
      return {}
    }

    if (typeof css !== 'object') {
      return {}
    }

    const res = {}
    each(rules, (value, key) => {
      const name = Css.getName(key)
      const rule = Css.getRule(value)
      if (!rule) {
        return
      }
      if (typeof rule !== 'string' && typeof rule !== 'object') {
        return
      }
      res[name] = rule
    })
    return res
  }
}
export default Css
