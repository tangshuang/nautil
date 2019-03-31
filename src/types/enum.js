import Type from './type.js'
import { isInstanceOf } from '../utils/index.js'
import { Error } from './error.js'

export function Enum(...patterns) {
  const EnumType = new Type(...patterns)
  EnumType.name = 'Enum'
  EnumType.assert = function(value) {
    let rules = this.rules
    for (let i = 0, len = rules.length; i < len; i ++) {
      let rule = rules[i]
      let match
      if (isInstanceOf(rule, Type)) {
        match = rule.test(value)
      }
      else {
        let type = new Type(rule)
        match = type.test(value)
      }

      // if there is one match, break the loop
      if (match) {
        return
      }
    }

    throw new Error('refuse', { value, type: this, action: 'assert' })
  }
  return EnumType
}
