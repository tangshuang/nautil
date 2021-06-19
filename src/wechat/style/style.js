import { Style } from '../../lib/style/style.js'
import { isNumber, isNumeric } from 'ts-fns'

Style.stringify = function(rules) {
  const keys = Object.keys(rules)
  let str = ''

  keys.forEach((key) => {
    const rule = rules[key]
    const name = key.replace(/[A-Z]/, (matched) => {
      return '-' + matched.toLocaleLowerCase()
    })
    const value = isNumber(rule) || isNumeric(rule) ? rule + 'px' : rule
    str += `${name}: ${value}`
  })

  return str
}

export { Style }
export default Style
