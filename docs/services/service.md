# Service

```js
import { Service } from 'nautil'

class SomeService extends Service {
  static otherService = OtherService

  doSome() {
    return this.otherService.request()
  }
}

const service = SomeService.instance()
```

Use `instance` static method to get a shared instance of service in your application.
