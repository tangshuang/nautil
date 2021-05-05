import { each } from 'ts-fns'

export class Css {
  static transform(rules) {
    return rules
  }
  static create(css) {
    if (!css) {
      return {}
    }

    if (css.rules && typeof css.rules === 'object') {
      const { rules, camel = true } = css
      if (camel) {
        const res = {}
        each(rules, (value, key) => {
          const items = key.split(/\W|_/).filter(item => !!item).map((item, i) => i > 0 ? item.replace(item[0], item[0].toUpperCase()) : item)
          const name = items.join('')
          res[name] = value
        })
        return Css.transform(res)
      }
      return Css.transform(rules)
    }

    if (typeof css === 'object') {
      return Css.transform(css)
    }

    return {}
  }
}
export default Css
