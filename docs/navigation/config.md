# Navigation Configuration

To create a navigation, you should do

```js
import { Navigation } from 'nautil'
const navigation = new Navigation(config)
```

The `config` object is like:

```js
const config = {
  /**
   * which mode to use, notice that, we will build a cross-platform application,
   * so sometimes, it is not work in react-native or wechat-miniprogram.
   * - none: keep navigation state in memory, when you refresh your page, it diswork any more
   * - storage: keep navigation state in localStore or AsyncStore
   * - history: use url path to determine navigation state
   * - hash: use url hash to determine navigation state
   * - search: use url query search to determine navigation's state
   */
  mode: 'history|hash|search|storage|none', // optional
  searchQuery: '_url', // optional, only works when mode=search, ?_url=urlencode(xxxx)

  /**
   * base path
   * sometimes, your site is in a sub path, for example, your site is visited by http://xx.com/site/
   * you should set `base` to be `/site/`
   */
  base: '/', // optional

  /**
   * to define routes of your application
   */
  routes: [ // required
    {
      // the id of this route, which will be used by Navigate
      name: 'home', // required

      // path is to determine which state is currently hold by navigation
      path: '/home', // required

      // default parameters for this route
      // notice, you are able to pass parameters between different Routes, learn more later
      params: {}, // optional

      // sub routes
      children: [ // optional
        {
          // the some as parent route structure
        }
      ],

      // enter and leave hook functions
      onEnter() {},
      onLeave() {},

      /**
       * you can event pass a exits component instead,
       * this is another usage, we will talk about this in `Navigator` doc
       */
      component: NautilComponent || FunctionComponent,
      animation: 600, // optional, number
      props: {},
    },
  ],

  // the max count of history record in memory
  maxHistoryLength: 20, // optional

  // the first route to use when user enter
  defaultRoute: 'home', // optional, if not pass, use the first route in `routes`

  /**
   * when navigation is routed to a unfund route, the `notFound` option will work then
   */
  notFound: NautilComponent || FunctionComponent || {
    component: NautilComponent || FunctionComponent,
    animation: 600, // optional, number
    props: {},
  },
  // not found hook function
  onNotFound() {},
}
```
