import { Component, mount, Model } from 'nautil'

/**
 * 1.如何创建一个组件？
 * 扩展Component这个类，必须定义render方法，自带了this.state
 */
class Box extends Component {

  // 规定接收的props的数据类型，在运行时检查这个数据类型
  // 没有在这里规定的props，不会被接收
  static props = {
    size: Number,
    weight: Number,
    onTouch: Function,
  }

  // 规定this.state的初始值
  static state = {
    size: 10,
    weight: 20,
  }

  // this.state是state和props合并后得到的结果，并且双向绑定：
  // 当执行this.state.size ++之后，不仅this.state.size发生了变化，外层传入的size属性所绑定的值也发生了变化
  // 当外层传入的size属性的值发生变化之后，这里的this.state.size也会发生变化，并更新界面

  handleClick = this.handleClick.bind(this)
  handleStream = this.handleStream.bind(this)

  handleClick(event) {
    this.state.size ++
    this.state.onTouch(event) // 来自props的属性
  }

  updateBatch() {
    // 虽然两次修改了数据，但是只会执行一次重新渲染
    this.state.size ++

    const { size } = this.state // 同步获取最新的size值
    this.state.weight = size * 10
  }

  // onClick$这个属性的末尾加上$表示click事件创建一个流
  handleStream(stream) {
    // 基于stream更新数据，用于异步数据修改的情况
    // 执行结果相当于this.state.size = x * 100，但是是异步的
    return stream.map(event => event.pageX).map((x) => ({
      size: x * 100,
    }))
  }

  render() {
    return <div onClick={this.handleClick}>
      {this.state.name}
      {this.state.size}
      {this.state.weight}

      <a href="#" onClick$={this.updateStream}>stream</a>
    </div>
  }

}

/**
 * 2.如何渲染？
 */
// 提供了一个color属性，但是，这个属性在内部没有用到
mount('#app', <Box size={100} color="red" />)

/**
 * 3.如何嵌套组件？
 */
// 一个render函数内的props具备整体响应的能力
class App extends Component {
  static props = {
    size: Number,
  }
  static state = {
    weight: 10,
  }

  handleFn(...args) {
    // 被传入Box内部使用
  }

  render() {
    return <div>
      {this.state.size}
      <Box size={this.state.size} weight={this.state.weight} onTouch={this.handleFn} />
    </div>
  }
}
// 在这个render内，内部Box引起的size变化，会带来App和Box中size的同时变化
const app = mount('#app2', <App size={12} />)
// 监控内部数据变化
app.on('stateChange', e => {})
app.on('propsTypeError', e => {})

/**
 * 4.如何外部修改数据更新界面？
 */
// 外部更新数据
const model = new Model({ // Model实例是响应式的
  size: 100,
  weight: 90,
  color: 'red',
})
const app2 = mount('#app3', Box, model) // => 类似 mount('#app3', <Box {...model} />) 但通过...model的形式会导致model无法拥有响应式能力
// 通过外部重新渲染界面。注意，要使用这种功能，model必须是nautil提供的Model的实例，并且，以第三个参数的形式去传入到mount中
model.color = 'blue'

// 还有一种外部更新数据的方式
const data = {
  size: 100,
  weight: 90,
  color: 'red',
}
const app3 = mount('#app4', Box, data)
data.size = 120 // 外部的data发生变化不会影响内部的data，因为内部的data并非对外部data的直接引用，而外部的data又不是响应式的
app3.update() // app.update方法重新去diff，然后渲染
