# Nautil

充满创意的 JS 前端框架。
Nautil 为“鹦鹉螺”的英文单词前段，鹦鹉螺是一种古老的生物，是一种奇异的生长生物，在腾讯内代表“创新”。

⚠️ nautil 还在开发中，还未在生产环境验证。欢迎广大开发者在此基础上贡献代码。

## 项目背景

前端框架的发展非常迅速，但是随着主流框架在架构层面越来越趋于一致，以React、Vue为主的编程生态各有优劣。
React 是近些年来最为优秀的前端开发工具。然而，它仅仅是一个库，需要用一个庞大的生态来解决应用开发中的问题。
Nautil 因此而生，它基于 React，为开发者提供一套完整统一的解决方案——框架。

在我看来，一个前端框架，需要为开发者一次性提供：

- UI 渲染
- 前端路由
- 状态管理
- 数据请求
- 数据类型检查
- 跨端开发方案
- 多语言国际化

Nautil 基于 React 的 UI 编程能力，在此基础上，提供独立而简单的其他部件，从而形成完整的开发框架。它包含了独立的路由、状态管理、异步数据请求等。
并且基于 React Native，提供有限的原生应用支持能力。

## 快速预览

在 React 的编程中，你需要引入一大堆包来解决各种问题，而在 Nautil 中，你不需要很多包，只需要 1 个。

### 多端开发

我们使用 nautil/dom 来实现 web 端渲染, 使用 nautil/native 来获得 native 的开发能力。

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

在原理上，我们要求开发者在开发时，必须使用 nautil 的基础组件完成 UI 界面的渲染。在实际运行时，通过 js 原型链方法重写的方式，在不同端重写基础组件的底层渲染逻辑，比如在 web 端，调用 react 对 html 组件的支持，在 native 端调用 react-native 提供的内置组件。这样，我们通过一套自己的组件，抹平各端开发的差异。

### 状态管理

我们提供了更方便的全局状态管理工具 `Store` 来帮助开发者管理应用的全局状态。你可以快速定义一个 store，并且通过它的方法对数据进行操作。
最重要的是，一个 store 实例是响应式的，你可以通过 watch 观察它内部的变化，从而决定是否要重新渲染界面。

```js
import { Component, Store, ObservableProvider } from 'nautil'
import { Section, Text } from 'nautil/components'

// 创建一个 store
const store = new Store({
   name: 'tomy',
   age: 10,
})

class App extends Component {
  render() {
    return (
      <ObservableProvider
        name="$state" value={store.state} // 将 store.state 以别名 $state 提供给下游，使用 store.state 可获取一个类似于 vue 中的响应式数据
        subscribe={dispatch => store.watch('*', dispatch)} dispatch={this.update} // 通过 watch 观察 store 变化，更新界面
      >
        <Page1></Page1>
      </ObservableProvider>
    )
  }
}

class Page1 extends Component {
  static injectProviders = {
    $state: true, // 获取由 ObservableProvider 提供的 $state，并注入到组件的 this 上，可使用 this.$state 便捷获取
  }
  render() {
    return <Section>
      <Text>Hi, I am {this.$state.name}, and I am {this.$state.age} years old.</Text>
    </Section>
  }
}
```

要让状态的变化出发界面重绘，还需要使用 `ObservableProvider` 这个内置组件，它可以通过订阅和发布来更新界面。
`Store` 是一个可以独立运行的状态管理工具，你甚至可以在其他系统中使用它。

### 路由管理

我们提供统一的路由接口，它用于创建和监听路由状态。你需要使用 `Navigator` 来将使用路由的内容包在内部。内部，你可以使用 `Navigate` 组件来跳转。

```js
import { Component, Navigation, Navigator, Switch, Case } from 'nautil'

import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

// 创建一个路由导航
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
    },
    {
      name: 'page2',
      path: '/page2/:type/:id',
      // default params
      params: {
        type: 'animal',
      },
    },
  ],
})

class App extends Component {
  render() {
    return (
      // Navigator 可监听 navigation 内部的变动，并通过 dispatch 触发界面更新
      <Navigator navigation={navigation} dispatch={this.update}>
        <Switch of={navigation.status}>
          <Case value="page1">
            <Page1></Page1>
          </Case>
          <Case value="page2">
            <Page2 type={navigation.state.params.type} id={navigation.state.params.id}></Page2>
          </Case>
          <Case default>
            <NotFound></NotFound>
          </Case>
        </Switch>
      </Navigator>
    )
  }
}

function NotFound() {
  return <div>Not Found!</div>
}
```

一个应用只能调用一次 `Navigator`。
同时，你需要配合 `Switch` `Case` 才能完成整个页面的路由规则。
在 native 开发时，我们会在系统内部模拟一套类似 web 一样的路径系统，从而用于抹平路由在不同端的表现。

### 数据仓库

我们发明了一套新的数据管理理论——数据仓库，（这里的数据指从后台 api 拉取的数据，）用以解决前端应用中从后台拉取数据和推送数据请求。

```js
import { Component, ObservableProvider, Depository, Prepare } from 'nautil'
import { Text } from 'nautil/components'

// 数据源配置
const datasources = [
  // ...
]

// 创建数据仓库
const depo = new Depository({
   expire: 10000,
})

// 注册数据源
depo.register(datasources)

class App extends Component {
  render() {
    return (
      <ObservableProvider
        name="$depo" value={depo} // 提供 $depo
        subscribe={dispatch => depo.subscribe('some', dispatch).subscribe('tag', dispatch)} // 监听数据变化
        dispatch={this.update} // 当数据变化时，更新界面
      >
        <Page1></Page1>
      </ObservableProvider>
    )
  }
}

class Page1 extends Component {
  static injectProviders = {
    $depo: true, // 接收 $depo
  }

  render() {
    const depo = this.$depo
    const some = depo.get('some') // 从数据仓库读取名为 'some' 的数据源对应的数据，这是一个同步操作

    return (
      // 用一个 loading 效果去处理当数据还没有拉取到时的界面反馈
      <Prepare isReady={some} loadingComponent={<Text>loading...</Text>}>
        <Text>{some}</Text>
      </Prepare>
    )
  }
}
```

传统数据拉取和推送靠业务层代码发起 ajax 请求来解决。现在需要改变这种思维，我们通过数据仓库统一管理从 api 获取的数据，我们在业务层和后台之间创建了数据仓库，业务层逻辑不和后台直接打交道，而是和数据仓库打交道，业务层代码通过订阅仓库中的数据，从而不需要关心如何从后台拿数据的问题。

数据仓库是一个订阅/发布模式的设计，而在使用时，只需要从仓库中读取数据即可，不需要发出请求。这些操作是同步的，这意味着在 nautil 中你没有异步操作。

## Internationalization

Nautil 内置了 I18n 类来实现国际化。

```js
import { Component, ObservableProvider } from 'nautil'
import I18n from 'nautil/i18n'
import { Section, Text, Button } from 'nautil/components'

// 借助 i18next 的能力构建多语言，具体配置可以参考
// https://www.i18next.com/overview/configuration-options
const i18n = new I18n(options)

class App extends Component {
  render() {
    return (
      <ObservableProvider
         name="$i18n" value={i18n}
         subscribe={dispatch => i18n.on('onLoaded', dispatch).on('onLanguageChanged', dispatch)}
         dispatch={this.update}
      >
         <Page1></Page1>
      </ObservableProvider>
    )
  }
}

class Page1 extends Component {
  static injectProviders = {
    $i18n: true,
  }

  render() {
    const i18n = this.$i18n
    const t = i18n.t.bind(i18n)
    const changeLanguage = i18n.changeLanguage.bind(i18n)

    // 通过 t 函数读取对应 key 的多语言版本
    // 通过 changeLanguage 来切换语言
    return (
      <Section>
        <Text>{t('ILoveTheWorld')}</Text>
        <Button onHint={() => changeLanguage('zh-HK')}>change language</Button>
      </Section>
    )
  }
}
```

这里借助 ObservableProvider 来实现响应应用中的语言切换。
其中最重要的两个方法莫过于 `t` 和 `changeLanguage`。它内部完全依赖 i18next，如果你对这个框架比较熟悉，那么会对你很有帮助。

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
