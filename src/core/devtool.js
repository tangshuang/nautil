export const DevTool = {
  log(...args) {
    console.log(...args)
  },
  error(...args) {
    console.error(...args)
  },
  test(fn, args = [], context) {
    try {
      fn.apply(context, args)
      return true
    }
    catch (e) {
      DevTool.error(e)
      return false
    }
  },
  throw(msg) {
    throw new Error(msg)
  },
}

export function makeCodeStack() {
  let e = new Error()
  let stack = e.stack || e.stacktrace
  let stacks = stack.split('\n')
  stacks.shift()
  stacks.shift()
  stack = stacks.join('\n')
  return stack
}
