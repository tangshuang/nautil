import { Subject } from 'rxjs'
import { isFunction } from 'ts-fns'

export * from 'rxjs'

export function createStream(...args) {
  const subject = new Subject()
  const subscribe = args.pop()

  if (!args.length && isFunction(subscribe)) {
    subject.subscribe(pipes)
  }
  else if (args.length && isFunction(subscribe)) {
    const observable = subject.pipe(...args)
    observable.subscribe(subscribe)
  }

  return subject
}
