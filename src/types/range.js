import Type from './type.js'
import { isNumber } from '../utils/index.js'
import { Error } from './error.js'

export function Range(min, max) {
  if (!isNumber(min)) {
    min = 0
  }
  if (!isNumber(max)) {
    max = 1
  }
  if (min > max) {
    min = 0
    max = 1
  }

  const RangeType = new Type(min, max)
  RangeType.name = 'Range'
  RangeType.assert = function(value) {
    if (!isNumber(value)) {
      throw new Error('refuse', { value, type: this, action: 'assert' })
    }

    let [min, max] = this.patterns
    if (value >= min && value <= max) {
      return
    }

    throw new Error('refuse', { value, type: this, action: 'assert', min, max })
  }
  return RangeType
}
