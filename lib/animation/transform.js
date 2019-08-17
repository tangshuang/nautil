import { dict, ifexist, enumerate, tuple } from '../core/types.js'
import { each } from '../core/utils.js'

export class Transform {
  constructor(rules = {}) {
    this.rules = { ...rules }
  }
  assert(rules) {
    const TranslateType = enumerate([String, Number])
    const ParamsType = dict({
      rotate: ifexist(String),
      rotateX: ifexist(String),
      rotateY: ifexist(String),
      rotateZ: ifexist(String),
      scale: ifexist(String),
      scaleX: ifexist(String),
      scaleY: ifexist(String),
      translate: ifexist(tuple([TranslateType, TranslateType])),
      translateX: ifexist(TranslateType),
      translateY: ifexist(TranslateType),
      skew: ifexist(tuple([String, String])),
      skewX: ifexist(String),
      skewY: ifexist(String),
    })
    ParamsType.assert(rules)
  }
  set(rules) {
    this.assert(rules)
    Object.assign(this.rules, rules)
    return this
  }
  del(rules) {
    each(rules, (value, key) => {
      if (!value) {
        return
      }
      delete this.rules[key]
    })
    return this
  }
  get() {
    throw new Error(`Transform.prototype.get should be overrided.`)
  }
}

Transform.parse = function(str) {
  const blocks = str.split(' ').filter(item => !!item)
  const rules = {}
  blocks.forEach((item) => {
    const [name, x, y] = item.split(/[\(\,\)]/).map(item => item.trim())
    rules[name] = y ? [x, y] : x
  })
  return rules
}

Transform.generate = function(rules) {
  const trans = new Transform(rules)
  const res = trans.get()
  return res
}

export default Transform
