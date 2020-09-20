import { isArray } from 'ts-fns'

/**
 * Conbime operating, with order
 * @param {*} wrappers
 */
export function pipe(wrappers) {
  const items = [...wrappers]
  items.reverse()
  return function(C) {
    return items.reduce((C, wrap) => wrap(C), C)
  }
}

/**
 * Batch operating
 * @param {*} operate
 * @param {*} args
 */
export function multiple(operate, ...args) {
  const length = Math.max(...args.map(arg => isArray(arg) ? arg.length : 1))
  const params = []

  for (let i = 0; i < length; i ++) {
    const m = params[i] = []
    args.forEach((arg) => {
      const param = isArray(arg) ? arg[i] : arg
      m.push(param)
    })
  }

  const wrappers = params.map((item) => operate.apply(null, item))
  return pipe(wrappers)
}
