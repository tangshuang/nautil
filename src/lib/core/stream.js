export { Subject as Stream, Subject as default } from 'rxjs'

export function createStream(fn) {
  const stream$ = new Stream()
  if (fn) {
    fn(stream$)
  }
  return stream$
}