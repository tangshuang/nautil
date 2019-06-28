export * from 'ts-fns'

export function noop() {}

export function define(obj, prop, value) {
  Object.defineProperty(obj, prop, { value })
}
