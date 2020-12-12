# Stream

[Rxjs](https://github.com/ReactiveX/RxJS) is used in Nautil to handle event streams. But what is a stream? A stream is data points separated by time. Read [this article](https://javascript.tutorialhorizon.com/2017/04/28/rxjs-tutorial-getting-started-with-rxjs-and-streams/) to know what and [this page](https://rxjs.dev/guide/operators) to know how.

When you handle an event, you can pass a callback function, or, the deep usage, a stream pipe-chain and execution.

```
[operator1, operator2, ...operators, execution]
```

```js
import { map } from 'rxjs'

<Input
  value={state.value}
  onChange={[
    // pipe chain
    map(e => e.target.value),
    map(value => value ++),

    // subscriber
    value => console.log(value)
  ]}
/>
```

If you pass an array, the last item should must be a function which pass into `stream$.subscribe`.

```js
import { Stream } from 'nautil'

const change$ = new Stream()
change$.pipe(
  map(e => e.target.value),
  map(value => value ++),
).subscribe(
  value => console.log(value)
)

<Input
  value={state.value}
  onChange={change$}
/>
```

By supporting this pattern, you will be able to seperate your event stream from UX handlers.
