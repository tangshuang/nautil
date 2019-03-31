import Type from './type.js'
import { isArray } from '../utils/index.js'
import { xError, Error } from './error.js'

export function List(pattern) {
  // if pattern is not an array, it treated undefined
  if (!isArray(pattern)) {
    pattern = Array
  }

  const ListType = new Type(pattern)
  ListType.name = 'List'
  ListType.assert = function(value) {
    if (!isArray(value)) {
      throw new Error('refuse', { value, type: this, action: 'assert' })
    }

    let rule = this.rules[0]
    let error = this.validate(value, rule)
    if (error) {
      throw xError(error, { value, rule, type: this, action: 'assert' })
    }
  }
  return ListType
}
