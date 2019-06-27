import { Subject, Observable } from '../../node_modules/rxjs/index.js'

export * from '../../node_modules/rxjs/index.js'
export function createStream(fn) {
  const subject = new Subject()
  const observable = fn(subject)
  return observable instanceof Observable || observable instanceof Subject ? observable : subject
}
