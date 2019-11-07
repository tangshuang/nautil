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

Then open localhost:9000 to see the hello-world page, and then modify project code in `src` dir.

The project directory structure is like:

```
- src
  |- app: the logic codes for your project
  |- dom: the entry for dom
  |- native: the entry for native
  |- ssr: the entry for ssr and ssr-client
  |- web-component: the entry for web-component
  `- wechat-mp: the entry for wechat miniprogram
- .nautil: the configuration files for nautil-cli
  |- before.hook.js: run before all build, export a function
  |- after.hook.js
  |- postcss.config.js: configurations for postcss
  |- wechat-mp.config.js: configurations for mp-webpack-plugin
  |- [target].js: the configure file
```

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

Many components always provide basic feature with passed props. However, in a project, application would have state to drive UI changing.

How can we share state between components?

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

This is what we do in traditional react development. In fact, we share `color` between `Rect` and `Page1`, and we have to define a `state` in the root component. Now, let us have a change.

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

However, this is not good enough, we can not reuse `Rect` any more, it is now not a Pure UI Component which will keep state inside.

We will use HOC (High-Order Component) to wrap components. Now, let's create a wrapped component which is a HOC.

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

Until now, the change of store will not trigger rerendering. We can use another operator to wrap root component App.

```js
import { observe } from 'nautil/operators'

export default observe(store)(App)
```

Now when store change, `App` component will be rerendered.

By using `nautil/operators`, you wrap a Pure UI Component into a Bussiness Component which may keep state inside. However, A UI component should not contains business components inside. With this way of wrapping, you are able to decorate your component to be more reative.

## Step 6: data fetching

Now we are going to fetch data from backend. At first, let's create a mock service. Create or modify `before.hook.js` in `.nautil` dir, and put content:

```js
// .nautil/before.hook.js
module.exports = function() {
  return {
    devServer: {
      before(app) {
        app.get('/api', (req, res) => {
          res.send(JSON.stringify({
            time: Date.now(),
          }))
        })
      },
    },
  }
}
```

This file will be merged into initialized webpack config. Now stop the CLI command, and run `npm run dev:dom` again. Visit localhost:9000/api to seen the mock data.

Backend is ready. Now let's coding in frontend. We will use a inside `Depository` library.

What is a `Depository`? It is to keep data from backend. Data transports from backend to a depository, and temporarily store in one space of the depository. Frontend get data from this space directly. So, summary, you do not need to care about fetching, thd depository do it automaticly.

```js
import { Depository } from 'nautil'
import { observe, inject, pipe } from 'nautil/operators'
import { Prepare } from 'nautil/components'

const depo = new Depository({
  name: 'MY_DEPO',
  sources: [
    {
      id: 'info',
      url: '/api',
    },
  ],
}})

export function MyComponent(props) {
  const { depo } = props
  const info = depo.get('info')
  return (
    <Prepare ready={info} placeholder={<span>loading...</span>}>
      () => <span>{info.time}</span>
    </Prepare>
  )
}

export default pipe([
  observe(
    dispatch => depo.subscribe('info'),
    dispatch => depo.unsubscribe('info')
  ),
  inject('depo', depo),
])(MyComponent)
```

Here, we use `depo.get('info')` to get the data, at the time we call this, an ajax will be send to backend, and we will get undefined return value. When the data comes back from backend, and store into depository space, the UI will be updated becuase we have use `observe` to subscribe.

Now import it into `App` component to have a try.

# Step 7: router

Frontend router is necessary in an application. It is used to switch views by different urls.

Let's create a navigation in a seperate file.

```js
// navigation.js

import { Navigation } from 'nautil'

export const navigation = new Navigation({
  mode: 'history',
  base: '/',
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => <span>home</span>,
    },
    {
      name: 'about',
      path: '/about',
      component: () => <span>about</span>,
    },
  ],
})
export default navigation
```

Now we have a navigation, which has components inside. Let's use it in our App.

```js
// app.jsx

import navigation from './navigation.js'
import { Navigator } from 'nautil/components'

export default class App extends Component {
  render() {
    return (
      <>
        <button onClick={() => navigation.got('home')}>home</button>
        <button onClick={() => navigation.got('about')}>about</button>
        <Navigator navigation={navigation} inside />
      </>
    )
  }
}
```

There is another usage by using `Route`, you will learn how to use in the detail document.

## Step 8: build

Now our application is finished. We want to generate bundle files. Stop CLI command and run:

```
npm run build:dom
```

And the bundle files are now in `dist/dom` dir. Check it now!
