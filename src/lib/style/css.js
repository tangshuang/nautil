import { each } from 'ts-fns'

export class Css {
  static getName(key) {
    // camel case
    const items = key.split(/\W|_/).filter(item => !!item).map((item, i) => i > 0 ? item.replace(item[0], item[0].toUpperCase()) : item)
    const name = items.join('')
    return name
  }
  static getRule(rule) {
    return rule
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
      res[name] = Css.getRule(value)
    })
    return res
  }
}
export default Css
