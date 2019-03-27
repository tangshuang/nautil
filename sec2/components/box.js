import { Component, mount, Model } from 'nautil'
import { IfExists } from 'nautil/types'

/**
 * 1.如何创建一个组件？
 * 扩展Component这个类，必须定义render方法，自带了this.data
 */
class Box extends Component {

  // 规定接收的props的数据类型，在运行时检查这个数据类型，可以通过on('propsTypeError')来监控类型错误
  // 没有在这里规定的props，不会被接收
  // props发生变化时，有两种情况，一种是被绑定到this.data，这些值的变化，会引起对应的界面变化，另一种是没有被绑定到this.data上的值的变化，不会自动触发界面变化，内部无法知道这些props是否在外部变化了
  static props = {
    size: Number,
    weight: Number,
    handle: IfExists(Function),
  }

  // 规定this.data的初始值
  // props上同名的属性，会被绑定，props上的值会覆盖这里的初始值
  // 当this.data上的属性发生变化，而该值是来自props的，外层的props值也会发生变化，从而触发外层的界面更新
  // 不在data中的prop会被直接patch到this上，例如上面的handle，会被直接patch到this上变为this.handle
  static data = {
    size: 10,
    weight: 20,
  }

  handleClick = this.handleClick.bind(this)
  handleStream = this.handleStream.bind(this)

  handleClick(event) {
    this.data.size ++
    this.handle(event) // 来自props的属性
  }

  updateMultiple() {
    // 批量更新数据
    // 调用this.data.$update，虽然一次性更新多个数据，但是只执行一次重新渲染
    const size = ++this.data.size
    const weight = size * 10
    this.data.$update({
      size,
      weight,
    })
  }

  updateBatch() {
    // 虽然两次修改了数据，但是只会执行一次重新渲染
    this.data.$start()

    this.data.size ++
    this.data.weight ++

    this.data.$end();
  }

  // onClick$这个属性的末尾加上$表示click事件创建一个流
  handleStream(stream) {
    // 基于stream更新数据，用于异步数据修改的情况
    // 执行结果相当于this.data.size ++，但是是异步的
    return stream.map(event => event.pageX).map((data) => ({
      size: data.size + 1,
    }))
  }

  render() {
    return <div onClick={this.handleClick}>
      {this.data.name}
      {this.data.size}
      {this.data.weight}

      <a href="#" onClick$={this.updateStream}>stream</a>
    </div>
  }

}

/**
 * 2.如何渲染？
 */
// 提供来一个color属性，但是，这个属性不能在组件内通过修改data发生变化带来响应式效果
mount('#app', <Box size={100} weight={90} color="red" />)

/**
 * 3.如何嵌套组件？
 */
// 一个render函数内的props具备整体响应的能力
class Container extends Component {
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
      {this.data.size}
      <Box size={this.data.size} weight={this.data.weight} handle={this.handleFn} />
    </div>
  }
}
// 在这个render内，内部Box引起的size变化，会带来Container和Box中size的同时变化
mount('#app2', <Container size={12} />)

/**
 * 4.如何外部修改数据更新界面？
 */
// 外部更新数据
const model = new Model({ // Model实例是响应式的
  size: 100,
  weight: 90,
  color: 'red',
})
mount('#app3', Box, model) // => mount('#app3', <Box {...model} />)
// 监控内部数据变化
model.$watch('*', ({ newValue, oldValue }) => {
  console.log(newValue, oldValue)
})
// 通过外部重新渲染界面。注意，要使用这种功能，model必须是nautil提供的Model的实例，并且，以第三个参数的形式去传入到mount中
model.color = 'blue'

// 还有一种外部更新数据的方式
const data = {
  size: 100,
  weight: 90,
  color: 'red',
}
const app = mount('#app4', Box, data)
data.size = 120 // 外部的data发生变化不会影响内部的data，因为内部的data并非对外部data的直接引用，而外部的data又不是响应式的（内部的data变化会反馈到外部data上）
app.update() // app.update方法重新去diff，然后渲染
