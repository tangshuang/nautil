# Guide

This paper help you start Nuatil application quickly. You will learn how to initialize, build and dev your project.

## Step 1: environment

Nautil source code is written with ES7, so you should install NodeJs 10+ because of async/await syntax, in browser, it not support IE browser because of Proxy object. In fact, it is facing mobile development, so we are not care about old systems.

If you want to develop with react-native, you should prepare for your development environment by reading this [page](https://facebook.github.io/react-native/docs/getting-started).

## Step 2: initialize

```
mkdir my-app && cd my-app
npx nautil-cli init
npm run dev:dom
```

Then open localhost:9000 to see the hello-world page, and then midify project code in `src` dir.

The project directory structure is like:

```
- src
  |- app: the logic codes for your project
  |- dom: the entry for dom
  |- native: the entry for native
  |- ssr: the entry for ssr and ssr-client
  |- web-component: the entry for web-component
  `- wechat-mp: the entry for wechat miniprogram
- .nautil: the configuration files for nautil-cli tool
```

To active HRM (hot reload), open the `.env` file and add the following line in it, then restart with `npm run dev:dom`.

```
HOT_RELOAD=true
```

After hot reload setup, re-modify the source code and see the result in browser.

## Step 3: component

Go into `src/app` dir, and create a `rect.jsx` file in which we will create a Rect component.

```js
// rect.jsx
import { Component } from 'nautil'
import { Section } from 'nautil/components'

export class Rect extends Component {
  render() {
    const { color, width, height } = this.attrs
    return (
      <Section stylesheet={{ backgroundColor: color, width, height }}></Section>
    )
  }
}
export default Rect
```

Now our component is created, let's use it in our app.

```js
// app.jsx
import { Component } from 'nautil'
import { Text, Section } from 'nautil/components'
import Rect from './rect.jsx'

export default class App extends Component {
  render() {
    return (
      <Section>
        <Text>Hello Nautil!</Text>
        <Rect color="red" width={120} height={40} />
      </Section>
    )
  }
}
```

Then look into your opened browser, whether it updated?

Nautil Component is built on react component, so you can move your react components into Nautil directly, without any change.

## Step 4: shared state

The meta components which always provide basic feature with passed props. However, in a project, application would have state to drive UI changing.

However, now we want to share state between components.

```js
// page1.jsx
import { Component } from 'nautil'
import { Input } from 'nautil/components'

export class Page1 extends Component {
  render() {
    return (
      <>
        <Input value={this.props.color} onChange={e => this.props.onChange(e.target.value)} />
      </>
    )
  }
}
export default Page1
```

And then we use it in our app.

```js
// app.jsx
import { Component } from 'nautil'
import { Text, Section } from 'nautil/components'
import Rect from './rect.jsx'
import Page1 from './page1.jsx'

export default class App extends Component {
  state = {
    color: '#ffffff',
  }
  render() {
    return (
      <Section>
        <Text>Hello Nautil!</Text>
        <Rect color={this.state.color} width={120} height={40} />
        <Page1 color={this.state.color} onChange={color => this.setState({ color })} />
      </Section>
    )
  }
}
```

This is what we do in traditional react development. In fact, we share `color` between `Rect` and `Page1`, and we have to define a `state` in the root component. Now, let have a change.

```js
// store.js
export const store = new Store({ color: '#ffffff' })
export const state = store.state
export default store
```

And now we use this `store` in both components.

```js
// rect.jsx

import { state } from './store.js'

export class Rect extends Component {
  render() {
    const { color } = state
    const { width, height } = this.attrs
    return (
      <Section stylesheet={{ backgroundColor: color, width, height }}></Section>
    )
  }
}
```

```js
// page1.jsx

import { state, store } from './store.js'

export class Page1 extends Component {
  render() {
    return (
      <>
        <Input value={state.color} onChange={e => store.set('color', e.target.value)} />
      </>
    )
  }
}
export default Page1
```

And then, you can remove `state` from App.

```js
// app.jsx

export default class App extends Component {
  render() {
    return (
      <Section>
        <Text>Hello Nautil!</Text>
        <Rect width={120} height={40} />
        <Page1 />
      </Section>
    )
  }
}
```

Now we have shared state between components.


## Step 5: wrap components

However, this is not good enough, we can not reuse Rect any more, it is now not a Pure UI Component which will keep state inside.

We will use HOC (High-Order Component) to wrap meta components. Now, let's create a wrapped component which is a HOC.

```js
// rect.jsx
import { Component } from 'nautil'
import { Section } from 'nautil/components'

export class Rect extends Component {
  render() {
    const { color, width, height } = this.attrs
    return (
      <Section stylesheet={{ backgroundColor: color, width, height }}></Section>
    )
  }
}
export default Rect
```

```js
// app.jsx

import Rect from 'rect.jsx'
import { inject } from 'nautil/operators'
import { state } from './store.js'

const WrappedRect = inject('color', () => state.color)(Rect)

export default class App extends Component {
  render() {
    return (
      <Section>
        <Text>Hello Nautil!</Text>
        <WrappedRect width={120} height={40} />
        <Page1 />
      </Section>
    )
  }
}
```

Now we created a `WrappedRect` which is a HOC of `Rect`. In this case, we do not irrupt `Rect`, it is still a Pure UI Component, but we wrap it with an operator and make it reactive for shared state.

