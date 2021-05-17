# QueueService

The service provides four types of queues to help developer manage tasks.

## Usage

```js
import { Controller, QueueService } from 'nautil'

class MyController extends Controller {
  static queue = QueueService

  sendReuqest = () => new Promise(...)

  handleRequest = () => {
    this.queue.push(this.sendRequest)
  }
}
```

## options

You can use your own options by override `options` method:

```js
class MyQueueService extends QueueService {
  options() {
    const { MODES } = QueueService
    return {
      mode: MODES.PARALLEL, // how to run defer, default in parallel, optional
        /**
        MODES.PARALLEL: run defer immediately after pushing
        MODES.SERIAL: defer will run one by one after each deferer resolved
        MODES.SWITCH: always use the last defer, when push a new defer, the old deferers will be dropped
        MODES.SHIFT: use first defer at the start of queue, then use the latest defer after the previous defer finish
        */

      autoStart: true, // whether to run queue immediately when invoke push
      delay: 0, // number, default 0, delay to start the queue when push() or start() at the first time
      debounce: 0, // number, default 0, debounce come before delay and throttle
      throttle: 0, // number, default 0, throttle come before delay
        /**
        It is recommanded that: debounce works with switch; delay works with parallel, serial and shift; throttle works with serial switch and shift. Notice that, when the queue is running, delay will not work, it only works with a static queue which is going to start.
        */
    }
  }
}
```

```js
import { SerialQueueService, ParallelQueueService, ShiftQueueService, SwitchQueueService } from 'nautil'
```

Notice that, if you use `QueueService`, it will use MODES.PARALLEL as default, so the behaviour is equal to `ParallelQueueService`.

## API

**push(defer, success, fail, cancel)**

- defer: a function which return an instance of Promise / async function / sync function will be convert to be async function
- success: invoke after deferer resolved
- fail: invoke after deferer rejected
- cancel: invoke when a defer is going to be canceled

All of these parameters are functions.

```js
this.queue.push(defer1).then(callback).catch(fallback)
// is like:
this.queue.push(defer1, callback, fallback)
// however, success/fail come before callback/fallback in then/catch
// and success/fail are run in sync in process, and then/catch run in async
```

How to use XHR with abort?

```js
const defer = () => {
  let xhr = new XMLHttpRequest()
  let method = "GET"
  let url = "https://developer.mozilla.org/"
  xhr.open(method, url, true)
  xhr.send()

  const deferer = new Promise(...)
  deferer.cancel = () => xhr.abort()
  return deferer
}
this.queue.push(defer, null, null, deferer => deferer.cancel()) // cancel receive the deferer

// later
this.queue.cancel(defer)
```

**start()**

Start the queue when you set autoStart to be false. Or after stopped by stop, use start() to restart the queue.

When the queue is running, start will do nothing.

**clear()**

Clear the queue. The left defers will not run any more.

**cancel(defer)**

Cancel a certain defer. Notice, defer is the passed function.

At the same time, cancel which passed by push will be run too.

**stop(err)**

- err: should be an instance of Error

Stop the queue. onError callbacks will be invoked if `err` passed. However, defers which in the queue are not dropped, you can restart queue by using queue.start().

**end()**

Forcely end the queue.

difference between clear, cancel, stop and end

- clear: just drop the un-run defers, does not change the status of queue
- cancel: just drop one defer
- end: drop the un-run defers and change the status of queue, onEnd callbacks will be invoked
- stop: not drop any defer, throw error manually, queue status changes, onError callbacks will be invoked, can be continue by start

**on(type, fn)**

`type` in `end|error`.

Pass a function which will be invoked when the queue finish normanlly. Use off to unbind the callback.

```js
this.queue.on('end', fn)

el.addEventListener('click', () => {
  this.queue.push(defer)

  if (queue.status !== 1) {
    queue.off('end', fn)
    queue.start()
  }
})
```

**destroy()**

Destory the queue. ️⚠️ Never use it when queue is running. Use `queue.status === -1` to check whether the queue is stopped.

After destory, the queue is broken, don't use it any more.
