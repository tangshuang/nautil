import { Store } from 'nautil'
import DevTool from 'nautil/devtool'
import NautilDOM from 'nautil/dom'
import App from './app.jsx'

// 先创建实例，稍后mount
// App 组件的原型
// props 组件的props，以对象的形式传入
const app = new NautilDOM(App, { size: 12 })
app.mount('#app')
// 监听state变化，知道state具体在哪里变化，并且影响了其他哪些组件的
app.on('stateChange', DevTool.log)

// 链式操作mount
const app2 = new NautilDOM(App, { size: 12 }).mount('#app2')

/**
 * 如何外部修改数据更新界面？
 */
const store = new Store({ // Store实例是响应式的
  size: 100,
  weight: 90,
  color: 'red',
})
const app3 = new NautilDOM(App, store).mount('#app3')
// 当Nautil发现use对象是Store实例时，会自动执行 store.$watch('*', () => app3.update()) 通过监听store的变化，触发app3的重新渲染
store.color = 'blue' // 会触发app3.update()

// 如果不使用Store：
const data = {
  size: 100,
  weight: 90,
  color: 'red',
}
// data只是作为this.state初始值，不会被修改，修改也不会触发界面变化
const app4 = new NautilDOM(App, data).mount('#app3')
app4.update({
  size: 50,
  weight: 70,
})
