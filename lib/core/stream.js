import { Subject, Observable } from 'rxjs/_esm2015/index.js'

export * from 'rxjs/_esm2015/index.js'

export function createStream(fn) {
  const subject = new Subject()
  const observable = fn(subject)
  return observable instanceof Observable || observable instanceof Subject ? observable : subject
}
