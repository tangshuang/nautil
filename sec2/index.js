import { Store, Renderer } from 'nautil'
import App from './App.js'

// 先创建实例，稍后mount
const app = new Renderer(<App size={12} />)
app.mount('#app')

// 快速mount
const app1 = Renderer.mount(<App size={12} />, '#app1')

// 链式操作mount
const app2 = new Renderer(App).mount('#app2')

/**
 * 如何外部修改数据更新界面？
 */
const store = new Store({ // Store实例是响应式的
  size: 100,
  weight: 90,
  color: 'red',
})
const app3 = new Renderer(App, store).mount('#app3') // => 类似 mount('#app3', <Box {...store} />) 但通过...store的形式会导致store无法拥有响应式能力
// 通过外部重新渲染界面。注意，要使用这种功能，store必须是nautil提供的Store的实例，并且，以第三个参数的形式去传入到mount中
store.color = 'blue'

// 如果不使用Store，整个操作就会变得非常复杂：
const data = {
  size: 100,
  weight: 90,
  color: 'red',
}
const app4 = new Renderer(App, data).mount('#app3')
// 方法1
data.size = 120 // 外部的data发生变化不会影响内部的this.state，因为内部的this.state并非对外部data的直接引用，而外部的data又不是响应式的
app4.update() // app.update方法重新去diff，然后渲染
// 方法2：可以在update中传入新的数据，注意，该操作会修改data原始值
app4.update({
  size: 50,
  weight: 70,
})
