import { mount } from 'nautil'
import App from './App.js'

const app = mount('#app2', <App size={12} />)
app.on('stateChange', e => {}) // 监控内部数据变化
app.on('propsTypeError', e => {})

/**
 * 如何外部修改数据更新界面？
 */
const model = new Model({ // Model实例是响应式的
  size: 100,
  weight: 90,
  color: 'red',
})
const app2 = mount('#app3', App, model) // => 类似 mount('#app3', <Box {...model} />) 但通过...model的形式会导致model无法拥有响应式能力
// 通过外部重新渲染界面。注意，要使用这种功能，model必须是nautil提供的Model的实例，并且，以第三个参数的形式去传入到mount中
model.color = 'blue'

// 还有一种外部更新数据的方式
const data = {
  size: 100,
  weight: 90,
  color: 'red',
}
const app3 = mount('#app4', App, data)
data.size = 120 // 外部的data发生变化不会影响内部的data，因为内部的data并非对外部data的直接引用，而外部的data又不是响应式的
app3.update() // app.update方法重新去diff，然后渲染
