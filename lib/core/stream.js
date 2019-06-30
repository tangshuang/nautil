import { Subject } from 'rxjs'
import { isFunction, isArray } from 'ts-fns'

export * from 'rxjs'

export function createHandledStream(param) {
  var subject = new Subject()
  
  const args = isArray(param) ? [...param] : [param]
  const subscribe = args.pop() 

  if (args.length) {
    subject = subject.pipe(...args)
  }

  if (isFunction(subscribe)) {
    subject.subscribe(subscribe)
  }

  return subject
}
