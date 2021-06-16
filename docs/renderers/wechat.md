# 微信小程序渲染器

利用Nautil，你可以在微信小程序开发中直接使用react的能力进行开发。

## 方法1: 将nautil作为小程序npm包使用

直接在小程序项目中

```
npm i nautil
```

然后在微信开发者工具中找到“工具 -> 构建npm”，执行，查看项目下的miniprogram_npm目录下是否生成对应文件。

```json
// app.json
{
  "usingComponents": {
    "dynamic": "nautil/wechat/components/dynamic/dynamic"
  }
}
```

按照上面的方法在小程序注册一个全局组件。

```js
import { createBehavior } from 'nautil/wechat'
// 由于微信小程序不支持直接使用jsx，我们必须使用createElement代替jsx进行编程
// 如果你已经有写好的组件文件，又不想改动，那么可以全局替换 import React from 'react' 为 import { React } from 'nautil'，然后再编译
import { createElement } from 'nautil'

function Some() {
  return (
    createElement(
      'view',
      { class: 'my-view' },
      createElement('text', null, '内容'),
    )
  )
}

const behavior = createBehavior('data', Some)
export default behavior
```

然后再在你的小程序页面使用这个behavior：

```js
import SomeBehavior from './some.js'

Page({
  behaviors: [SomeBehavior],
})
```

同时在该页的wxml中使用：

```js
<dynamic data="{{ data }}" /> // 这里的data来自于createBehavior的第一个参数
```

**createBehavior**

创建一个基于react渲染器的微信小程序的Behavior。

```
createBehavior(dataKey, Component, props): Behavior
```

- dataKey: 用于渲染jsx的数据被放在this.data的什么属性上面，例如上面的例子中，在Page的this.data上存在this.data.data，它是jsx的渲染结果，用于传递给`<react>`完成真正的渲染
- Component: 一个react组件
- props: 该组件接收的props

有关Behavior的概念，你可以阅读[这里](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)。

**优点**

方法1的优点主要是完全不借助其他任何编译工具，可以通过微信开发者工具完成全部开发。
基于Behavior的设计，可以让你在不同的页面中，复用组件。

**缺点**

需要手写createElement，非常繁琐。
你可以在同级目录下创建一个 some.jsx 然后用babel把它编译到 some.js，编译的时候需要注意，`['@babel/preset-react', { runtime: 'classic' }]`，runtime不允许使用automatic，`import { React } from 'nautil'`，必须从nautil引入React而非从react引入，这样才能避免微信开发者工具无法编译的问题。这个方案还有一个问题是，.jsx文件会被打包到微信小程序中，应该在project.config.json中将它们排除。

## 方法2: 源码和小程序代码分开

在源码中撰写内容后，通过编译工具将源码构建到小程序工程目录下，再用微信开发者工具打开小程序工程目录预览和发布。

```
- src
  - behaviors
    - some.jsx
- miniprogram
  - pages
    - page-a
      - index.js
      - index.wxss
      - index.json
  - app.js
  - app.json
- project.config.json <- 注意，这个放在最外层
- package.json
```

在src目录下撰写jsx，通过babel进行编译后放到miniprogram目录下。
具体操作，需要在 project.config.json中增加setting:

```json
{
  "setting": {
    "miniprogramRoot": "./miniprogram", // <- 规定小程序运行目录
    "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./node_modules/nautil/package.json",
        "miniprogramNpmDistDir": "./miniprogram/"
      }
    ]
  }
}
```

然后在执行“工具 -> 构建npm”。完成之后，在微信开发者工具中，就可以正常编译了。

```js
// src/behaviors/some.jsx

import { createBehavior } from 'nautil/wechat'
import { React } from 'nautil' // <- 注意这里，必须从nautil中引入React，才能避免微信开发者工具编译报错

function Some() {
  return (
    <view class="my-view">
      <text>内容</text>
    </view>
  )
}

const behavior = createBehavior('data', Some)
export default behavior
```

全局组件、页面、模板的写法一致。

接下来，就是利用babel，将src目录下的源文件，编译到miniprogram目录下对应的位置下去。这样，小程序工程目录中的文件就可以require被编译好的文件，完成小程序自己的编译逻辑。

**优点**

可以直接写jsx，源码和小程序工程代码分开管理。

**缺点**

依赖编译工具。

## context

在react中，有一个context的概念，你可以通过this.context读取到组件的上下文信息。
在微信小程序中，我提供了一个通过context把微信小程序的上下文传递给组件的方法：

```js
import { registerApp } from 'nautil'

registerApp(context => {
  return {
    onLoad() {
      context.userId = ...
    },
  }
})
```

我提供了`registerApp`和`registerPage`两个方法，它们接收的第一个参数是一个函数，这个函数接收context，并返回小程序框架`App`和`Page`的参数。这样，你就可以在小程序的注册过程中，向context注入一些信息，在组件中，通过this.context读取这些信息。

registerPage默认支持传入createBehavior的参数，这样，你不需要在registerPage的时候混入behavior：

```js
// src/pages/some-page/some-page.js

import { registerPage } from 'nautil/wechat'
import { React } from 'nautil'

function MyComponent(props) {
  return (
    <view><text>{props.message}</text></view>
  )
}

registerPage(
  (context) => {
    return {
      data: {
        someData: 'xxx',
      },
    }
  },

  // 后面这三个参数，就是createBehavior的参数
  'jsx', // <- 注意，不能和已有的data上的属性冲突
  MyComponent,
  { message: 'mmmmm' },
)
```

## 方法3: 基于Nautil框架的跨平台开发（尚未发布）

```
npx nautil-cli init
```

通过nautil-cli创建项目，然后选中使用wechat。
之后，你完全使用nautil-cli完成项目构建，构建wechat代码时，由于cli工具内置了非常丰富的编译时功能，你可以非常便捷实现跨平台开发（例如，你需要让你的代码完全跑在H5和小程序上）。

```js
// src/wechat/index.js
import { runApp } from 'nautil/wechat'
import App from '../app/app.jsx' // <- 告知cli工具使用哪个文件作为App文件

export default runApp(
  App, // 这个App包含了navigation，另外，它不接收props
  // 下面两个参数目的是为了得到想要的context
  function registerApp(context) {}, // 传给registerApp作为参数
  function registerPage(context) {}, // 传给registerPage作为参数
)
```

Cli工具会分析app.json, project.config.json和上面这个文件（不是直接编译它），并根据分析的结果，创建对应的其他所有文件。（当然，不包括app.json, project.config.json文件。）
