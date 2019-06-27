import { Subject } from 'rxjs'

export * from 'rxjs'
export function createStream(fn) {
  const subject = new Subject()
  fn(subject)
  return subject
}
