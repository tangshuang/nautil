export const DevTool = {
  log(...args) {
    console.log(...args)
  },
  error(...args) {
    console.error(...args)
  },
  run(fn, context, ...args) {
    fn.apply(context, args)
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

export default DevTool
