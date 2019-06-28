export * from 'ts-fns/index.js'

export function noop() {}

export function define(obj, prop, value) {
  Object.defineProperty(obj, prop, { value })
}