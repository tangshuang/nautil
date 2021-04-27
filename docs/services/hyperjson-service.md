# HyperJSONService

> Notice: HyperJSONService is not exported by default, you should use `import HyperJSONService from 'nautil/lib/services/hyperjson-service'` to use it.

Use a JSON object to describe jsx structure.

```js
import HyperJSONService from 'nautil/lib/services/hyperjson-service'
import { Controller } from 'nautil'

class MyController extends Controller {
  static hyper = HyperJSONService

  MyComponent() {
    return this.hyper.parse(someJSON, { components })
  }
}
```

**parse(hyperJSON, options)**

Read [here](https://www.tangshuang.net/8026.html) to know more about HyperJSON.
And you may need to know [scopex](https://github.com/tangshuang/scopex) to understand the parser.

options:

- scope: an object to inject scope into scopex
- components: provide custom components in hyperJSON
- filters: provide filters for scopex
