# EventService

A global event service to listen and trigger event amoung modules.

```js
import { EventService } from 'nautil'

const eventService = new EventService()

eventService.on('someEvent', () => ...)

eventService.emit('someEvent')

eventService.off('someEvent', fn)

eventService.once('someEvent', fn)

if (eventService.hasEvent('someEvent')) {
  ...
}
```

```js
import { EventService, Controller } from 'nautil'

class MyEventService extends EventService {}

class MyController extends Controller {
  static eventService = MyEventService

  init() {
    this.eventService.on('xxx', this.handler)
  }

  destroy() {
    this.eventService.off('xxx', this.handler)
  }
}
```
