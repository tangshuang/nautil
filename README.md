# Nautil

充满创意的 JS 前端框架。
Nautil 为“鹦鹉螺”的英文单词前段，鹦鹉螺是一种古老的生物，是一种奇异的生长生物，在腾讯内代表“创新”。

【项目状态】nautil 还在开发中，还未在生产环境验证。欢迎广大开发者在此基础上贡献代码。

## 项目背景

前端框架的发展非常迅速，但是随着主流框架在架构层面越来越趋于一致，以React、Vue为主的编程生态各有优劣。
React 是近些年来最为优秀的前端开发工具。然而，它仅仅是一个库，需要用一个庞大的生态来解决应用开发中的问题。
Nautil 因此而生，它基于 React，为开发者提供一套完整统一的解决方案——框架。

在我们看来，一个前端框架，需要为开发者一次性提供：

- 基本的 UI 渲染模式（例如“模板”或“Virtual DOM”）
- 前端路由
- 数据/状态管理（例如 redux）
- 异步数据处理（例如 AJAX）
- 数据类型检查（可选，但在前后端耦合的情况下非常有必要）
- 跨端开发方案（例如 taro）

Nautil 基于 React 的 UI 编程能力，在此基础上，提供独立而简单的其他部件，从而形成完整的开发框架。它包含了独立的路由、状态管理、异步数据处理、类型检查等模块。并且基于 React Native，提供有限的原生应用支持能力。

## 快速预览

在 React 的编程中，你需要引入一大堆包来解决各种问题，而在 Nautil 中，你不需要很多包，只需要 1 个。

### 多端开发

```js
import { Component } from 'nautil'
import { Section, Text } from 'nautil/components'
import { mount } from 'nautil/dom'

class App extends Component {
   render() {
      return <Section>
         <Text>This is an app.</Text>
      </Section>
   }
}

mount('#app', App)
```

上面我们使用了 nautil/dom, 此外我们可以使用 nautil/native 来获得 react-native 的开发能力。
在原理上，我们要求开发者在开发时，必须使用 nautil 的基础组件完成 UI 界面的渲染。在实际运行时，通过 js 原型链方法重写的方式，在不同端重写基础组件的底层渲染逻辑，比如在 web 端，调用 react 对 html 组件的支持，在 native 端调用 react-native 提供的内置组件。这样，我们通过一套自己的组件，抹平各端开发的差异。（当然，在实际运行中，这种差异还是会有细节上的不同。）

### 状态管理

```js
import { Component, Store, Observer, Provider } from 'nautil'
import { Section, Text } from 'nautil/components'
import { mount } from 'nautil/dom'

const store = new Store({
   name: 'tomy',
   age: 10,
})

class Page1 extends Component {
   static injectProps = {
      $state: true,
   }
   render() {
      return <Section>
         <Text>Hi, I am {this.$state.name}, and I am {this.$state.age} years old.</Text>
      </Section>
   }
}

class App extends Component {
   render() {
      return <Observer subscribe={dispatch => store.watch('*', dispatch)}>
         <Provider $state={store.state}>
            <Page1></Page1>
         </Provider>
      </Observer>
   }
}

mount('#app', App)
```

我们提供了更方便的全局状态管理工具 `Store` 来帮助开发者管理应用的全局状态。它是一个可以独立运行的状态管理工具。要让状态的变化出发界面重绘，还需要使用 `Observer` 这个内置组件，它可以通过订阅来触发内部组件的更新。`Provider` 组件则向内部组件提供注入 props 的能力，这样，在 `Page1` 组件内就可以更快捷的获得被注入的 prop，当然，你也可以选择不使用 `Provider` 而直接通过 props 传递。

### 路由管理

```js
import { Component, Router, Observer, Switch, Case } from 'nautil'
import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'
import { mount } from 'nautil/dom'

const router = new Router({
  base: '/app',
  mode: 'history',
  routes: [
    {
      name: 'home',
      url: '/',
      redirect: 'page1',
    },
    {
      name: 'page1',
      url: '/page1',
    },
    {
      name: 'page2',
      url: '/page2/:type/:id',
      // default params
      params: {
        type: 'animal',
      },
    },
  ],
})

function NotFound() {
  return <div>Not Found!</div>
}

class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => router.on('*', dispatch)}>
        <Switch of={router.status}>
          <Case value="page1">
            <Page1></Page1>
          </Case>
          <Case value="page2">
            <Page2 type={router.state.params.type} id={router.state.params.id}></Page2>
          </Case>
          <Case default>
            <NotFound></NotFound>
          </Case>
        </Switch>
      </Observer>
    )
  }
}

mount('#app', App)
```

我们提供统一的路由接口。它用于创建和监听路由状态，并通过 `on` 方法对路由状态变化作出反馈。但是，从编程上，它仅仅是一个库的功能，你需要配合 `Observer` `Switch` `Case` 才能完成整个页面的路由规则。
在 native 开发时，我们会在系统内部模拟一套类似 web 一样的路径系统，从而用于抹平路由在不同端的表现。

### 数据仓库

```js
import { Component, Provider, Observer, Depository, Prepare } from 'nautil'
import { Text } from 'nautil/components'
import { mount } from 'nautil/dom'

const datasources = [
   // 数据源配置
]

const depo = new Depository({
  expire: 10000,
})

depo.register(datasources)

class Page1 extends Component {
  static validateProps = {
    $depo: Depository,
  }

  static injectProps = {
    $depo: true,
  }

  render() {
    const depo = this.$depo
    const some = depo.get('some')
    return (
      <Prepare isReady={some} loadingComponent={<Text>loading...</Text>}>
        <Text>{some}</Text>
      </Prepare>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => depo.subscribe('some', dispatch).subscribe('tag', dispatch)}>
        <Provider $depo={depo}>
          <Page1 />
        </Provider>
      </Observer>
    )
  }
}

mount('#app', App)
```

我们发明了一套新的数据管理理论——数据仓库，用以解决前端应用中从后台拉取数据和推送数据的逻辑。传统数据拉取和推送靠业务层代码发起 ajax 请求来解决。这样做的好处是便于新手理解。但是坏处是要解决不同组件之间发起同一个请求的浪费问题。
要改变这种思维，我们通过数据仓库统一管理后台数据，我们在业务层和后台之间创建了数据仓库，业务层逻辑不和后台直接打交道，而是和数据仓库打交道，业务层代码通过订阅仓库中的数据，从而不需要关心如何从后台拿数据的问题。

数据仓库是一个订阅/发布模式的设计，而在使用时，只需要从仓库中读取数据即可，不需要发出请求。这些操作是同步的，这意味着在 nautil 中你没有异步操作。
上面的实例代码中，你需要借助 `Observer` 来订阅仓库中的数据变化，通过 `Prepare` 来解决当数据还没有从后端拉取回来时应该怎么显示界面。

## 开发者言

当你在使用 nautil 进行开发时，我希望你保持下面的心态：

- 忘掉 react，就当 nautil 是完全遵循 react 语法的另外一套框架
- 时刻记住自己在进行多端开发（很多 css 不能用）
- 使用 nautil 内置基础组件，而非使用 react 或 react-native 的内置组件（除非你确定你打算用 nautil 做单端开发）
- 使用 css module 的方式使用样式，在构建 react-native 应用时，使用 react-native-css-loader 对 css 进行转化
- 使用 babel-plugin-react-require 插件自动插入对 react 的引用

## MIT License

Copyright 2019 tangshuang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
