import { Store, Nautil } from 'nautil'
import App from './App.js'

// 先创建实例，稍后mount
const app = new Nautil(<App size={12} />)
app.mount('#app')

// 链式操作mount
const app2 = new Nautil(<App size={12} />).mount('#app2')

/**
 * 如何外部修改数据更新界面？
 */
const store = new Store({ // Store实例是响应式的
  size: 100,
  weight: 90,
  color: 'red',
})
const app3 = new Nautil(<App size={12} />).mount('#app3').use({ store }) // app3内部所有组件将拥有this.store
// 当Nautil发现use对象是Store实例时，会自动执行 store.$watch('*', () => app3.update()) 通过监听store的变化，触发app3的重新渲染
store.color = 'blue' // 会触发app3.update()

// 如果不使用Store：
const data = {
  size: 100,
  weight: 90,
  color: 'red',
}
const app4 = new Nautil(<App size={12} />).mount('#app3').use({ data }) // this.data
// 方法1
data.size = 120 // 外部的data发生变化不会影响内部的this.state，因为内部的this.state并非对外部data的直接引用，而外部的data又不是响应式的
app4.update() // app.update方法重新去diff，然后渲染
// 方法2：可以在update中传入新的数据，注意，该操作会修改data原始值
app4.update({
  size: 50,
  weight: 70,
})
