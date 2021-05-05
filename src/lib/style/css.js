import { each } from 'ts-fns'

export class Css {
  static transform(rules) {
    return rules
  }
  static create(css) {
    if (!css) {
      return {}
    }

    if (typeof css !== 'object') {
      return {}
    }

    let info = css

    if (!info.rules || typeof info.rules !== 'object') {
      info = { rules: css }
    }

    const { rules, camel = true } = info

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
}
export default Css
