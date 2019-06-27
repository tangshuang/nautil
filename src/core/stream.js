import { Subject, Observable } from 'rxjs'

export * from 'rxjs'
export function createStream(fn) {
  const subject = new Subject()
  const observable = fn(subject)
  return observable instanceof Observable || observable instanceof Subject ? observable : subject
}
