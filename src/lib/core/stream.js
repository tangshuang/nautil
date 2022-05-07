import { Subject as Stream } from 'rxjs'

export { Stream }

export function createStream(fn) {
  const stream$ = new Stream()
  if (fn) {
    fn(stream$)
  }
  return stream$
}
