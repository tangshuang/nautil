# Nautil

充满创意的 JS 响应式编程前端框架。
Nautil 为“鹦鹉螺”的英文单词前段，鹦鹉螺是一种古老的生物，是一种奇异的生长生物，在腾讯内代表“创新”。

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

在 React 的编程中，你需要引入一大堆包来解决各种问题，而在 Nautil 中，你不需要很多包，只需要两个。

```js
import { React, Component, Section, Text } from 'nautil'
import { render } from 'nautil-dom'

class App extends Component {
   render() {
      return <Section>
         <Text>This is an app.</Text>
      </Section>
   }
}

render(document.querySelector('#app'), App)
```

使用全局的状态管理：

```js
import { React, Component,
   Store, Observer, Provider,
   Section, Text } from 'nautil'
import { render } from 'nautil-dom'

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

render(document.querySelector('#app'), App)
```