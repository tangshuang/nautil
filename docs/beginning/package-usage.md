# Package Usage

```js
import { Component } from 'nautil'
```

You should must use building tools to transform the source code, we did not provide runtime package.

We recommand use `nautil-cli` to build even through it is not nessesary.
Your building tool should must support rewrite `process.env.NODE_ENV` to real env vars.

Nautil is using ES6 `Proxy` to implement reactive system, so your building targets should must support `Proxy`.
This means nautil does not support low version browsers such as IE, earlier chrome or firefox.
Here is a browserslist:

```browserslist
chrome 49
firefox 18
edge 12
safari 10
opera 36
```

To render Nautil components, you should import renderer from different platform exports:

```js
import { mount, update, unmount } from 'nautil/dom'
```

Nautil almost exports all APIs in main/top entry file, however, the following are not:

```js
import HyperJSONService from 'nautil/lib/services/hyperjson-service'
```

Nautil is based on react@^16.8 and use react@17.x inside, if your project are using higher version (i.e. react@18.x), you should use inner React to render nautil components:

```js
import { React } from 'nautil'
```

And `tyshemo` is a inner driver, if you need full APIs of tyshemo, you can import like:

```js
import { TySheMo } from 'nautil'

const { shouldmatch, String8 } = TySheMo
```
