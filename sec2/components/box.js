import { Component, render } from 'nautil'

class Box extends Component {

  // 规定接收的props的数据类型，在运行时检查这个数据类型，可以通过on('propsTypeError')来监控类型错误
  // 这里列出来的props不是所有接收的props，你可以传入其他的props，但是，只有这里的props是响应式的，它们会被放到this.data之上
  static props = {
    size: Number,
    weight: Number,
  }

  // data初始值，会和props合并之后放到this.data上，注意，不能和props存在同名属性
  static data = {
    name: 'Tomy'
  }

  handleClick = () => {
    this.data.size ++
  }

  updateBatch() {
    // 当在一个方法内要进行多次数据更新时，而在数据更新过程中，又会重复使用数据，那么可以考虑$batchStart/$batchEnd，
    // 使用这种方法，不会多次触发响应式效果，而是会等到调用$batchEnd时才会触发在这期间所进行的所有数据更改，都不会对界面产生影响，包括在这过程中调用了其他方法更新了数据，它会等到收集完全部之后再更新
    // 注意，仅适用于同步操作，不适用于异步操作
    this.data.$batchStart()
    this.data.size ++
    const size = this.data.size
    const weight = size * 10
    this.data.weight = weight
    this.data.$batchEnd()
  }

  updateStream() {
    // 基于stream更新数据，用于异步数据修改的情况
    // 执行结果相当于this.data.size ++，但是是异步的
    this.stream.map((data) => ({
      size: data.size + 1,
    })).do()
  }

  render() {
    return <div onClick={this.handleClick}>
      {this.data.name}
      {this.data.size}
      {this.data.weight}
    </div>
  }

}

// 提供来一个color属性，但是，这个属性不能在组件内通过修改data发生变化带来响应式效果
render(<Box size={100} weight={90} color="red" />, '#app')

// 一个render函数内的props具备整体响应的能力
class Container extends Component {
  static props = ['size']
  static data = {
    weight: 10,
  }
  render() {
    return <div>
      {this.data.size}
      <Box size={this.data.size} weight={this.data.weight} />
    </div>
  }
}
// 在这个render内，内部Box引起的size变化，会带来Container和Box中size的同时变化
render(<Container size={12} />, '#app2')
