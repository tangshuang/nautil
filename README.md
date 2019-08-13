# Nautil

Nautil is a responsive, efficient, and flexible JavaScript framework for building cross-platform applications.

⚠️ In development, welcome to contribute!

## Background

React provides a very excellent development experience. However, it only provides a UI library, if you want to build an application with it, you have to think of many different proposals on different points.

To resolve this, I developed Nautil to provide developers a framework to be able to build a cross-platform application conveniently.

It is based on React, so you do not need to worry about the ecosystem.

One of our purposes is to build cross-platform application, so when you use it, you do not need to write two set of code, just one!

Nautil contains:

- UI rendering based on React
- router/navigation
- state management with observable store library
- data management and requesting with observable data library
- data type checker
- cross-platform development proposal with react-dom and react-native
- internationalization with i18next, and date/number/currency locale formatters

## Overview

Nautil is following observer pattern. In the development, you will find you often think about how to use observer pattern to trigger UI update. However, don't worry about it, it is easy.

With Nautil, you do not need to include other packages such as redux, router and ajax library. We have provided our own proposal which included inside. And later, you will find them amazing and interesting.

### Cross-platform

Import `nautil/dom` to render in web, and use `nautil/native` to build a react-native app.

```js
import { Component } from 'nautil'
import { Section, Text } from 'nautil/components'

export class App extends Component {
   render() {
      return <Section>
         <Text>This is an app.</Text>
      </Section>
   }
}

export default App
```

```js
import { mount } from 'nautil/dom'
import App from './App.jsx'

mount('#app', App)
```

Developers should use inside basic components which imported from `nautil/components`.
In deep, we override the prototype to make these basic components to act different ways in different platform.

### State

We do not advocate redux, it is too complex. We provide a inside-included library which is easy to understand to manage your application level state. It is called `Store` which is a observable data container.

```js
import { Component, Store, Observer } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

// create a store
const store = new Store({
   name: 'tomy',
   age: 10,
})

function Page1() {
  const { state } = store
  const grow = () => {
    state.age ++
  }
  return (
    <Section>
      <Text>Hi, I am {state.name}, and I am {state.age} years old.</Text>
      <Button onHint={grow}>grow</Button>
    </Section>
  )
}

class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => store.watch('*', dispatch)} dispatch={this.update}>
        <Page1 />
      </Observer>
    )
  }
}
```

Here, we use a `Observer` component which will update UI triggered by subscriber.
`Store` is a independent library, you can even use it in other system.

### Navigation

We often call this part router, but here we call it navigation.
It is implemented inside, and is cross-platform. A navigation is observable, so that you can change the UI when navigation changes.
`Navigator` is to provide navigation, and `Navigate` is to jump between routes.

```js
import { Navigation, Navigator, Navigate } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

// create a navigation
const navigation = new Navigation({
  base: '/app',
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      redirect: 'page1',
    },
    {
      name: 'page1',
      path: '/page1',
      component: Page1,
    },
    {
      name: 'page2',
      path: '/page2/:type/:id',
      component: Page2,
      // default params
      params: {
        type: 'animal',
      },
    },
  ],
  notFound: NotFound,
})

function App() {
  return (
    <Navigator navigation={navigation}></Navigator>
  )
}

function NotFound() {
  return (
    <Section>
      <Text>Not Found!</Text>
      <Navigate to="home" component={Button}>Home</Navigate>
    </Section>
  )
}
```

`Navigate` which in `Navigator` will be injected with provided navigation automaticly.
Look into examples and demo for more usages.

### Data Depository

In other system, developers should write many ajax services to request data from backend api. But in Nautil, you should not. You are recommended to follow a new idea of data manangement style: depository.

A data depository is in the middle of frontend business and backend api. For business code, developers do not care when and how to get data from backend api, just need to *get* data from depository.
Yeah, one action, *get* from depository.

```js
import { Component, Observer, Depository, Prepare } from 'nautil'
import { Text } from 'nautil/components'

// set data sources information
const datasources = [
  {
    id: 'articles',
    url: '/api/articles',
  },
  {
    id: 'tag',
    url: '/api/tags/{tag}',
  },
]

// create a data depository
const depo = new Depository({
   expire: 10000,
})

// register data sources into depository
depo.register(datasources)

function Page1() {
  const some = depo.get('tag', { tag: 'some name' })
  return (
    <Prepare isReady={some} loading={<Text>loading...</Text>}>
      <Text>{some.name}</Text>
    </Prepare>
  )
}

class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => depo.subscribe('articles', dispatch).subscribe('tag', dispatch)} dispatch={this.update}>
        <Page1 />
      </Observer>
    )
  }
}
```

In the example code, we use `depo.get` to get `some` from depository. When some does not exist in depository, it will return `undefined`, so we use `Prepare` component to provide a loading effect. And because we have subscirbe to `depo` and update when it change, after the data of `some` come back from backend api, `render` will be run again, and this time `some` has value.

Maybe, at first, you do not approbate `depo.get`, why don't I send an ajax? why don't I need to create an asynchronous task?
Finally, you will find it is interesting and genius with observer pattern.

### Internationalization

Don't waste time to think about whether or which library to include internationalization in your application. From my experience, do it, at the begining of your project early period.

To implement internationalization is very easy with nautil after you have tried the previous parts. We provide a i18n library inside, and it is also observable, the some way to use as others.

```js
import { Component } from 'nautil'
import { I18n, Language, T, Locale } from 'nautil/i18n'
import { Section, Text, Button } from 'nautil/components'

// https://www.i18next.com/overview/configuration-options
const i18n = new I18n(options)

class App extends Component {
  render() {
    return (
      <Language i18n={i18n} dispatch={this.update}>
        <Page1 />
      </Language>
    )
  }
}

function Page1() {
  return (
    <Section>
      <T>ILoveThisWorld</T>
      <Locale to="zh-HK" component={Button}>change language</Locale>
    </Section>
  )
}
```

## Have a try

To taste the feel, clone this repository, and run in CLI:

```
npm i
npm start
```

Open your brower to visit localhost:9000 and read the demo code in `demo` directory.

## For Developers

If you are going to work with Nautil, keep in mind:

- forget React, nautil is a new framework
- never forget you are build cross-platform application, so don't use abilities which only works for web
- use inside basic component from `nautil/components`, never use html components or react-native components
- use css module to import stylesheets, when build react-native appliction, install react-native-css-loader to transform css files
- install babel-plugin-react-require to import React automaticly

## MIT License

Copyright 2019 tangshuang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
