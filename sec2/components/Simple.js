import { Component, Ajax } from 'nautil'

export class Simple extends Component {
  props = ['name', 'age'] // 如果不需要对props进行类型检查，只需要传入一个数组即可

  // 用nautil内置的Ajax方法创建一个用于请求数据的ajax流
  calling$ = new Ajax({
    mode: 'switch',
    url: 'xxx',
    header: 'xxx',
  })

  // init在初始化完之后执行
  init() {
    // 使用最原始的值，下次修改originalName时，不会对state产生影响
    this.originalName = this.state.name
  }

  // onClick$这个属性的末尾加上$表示click事件创建一个流
  handleStream(stream) {
    // 基于stream更新数据，用于异步数据修改的情况
    // 执行结果相当于this.state.size = x * 100，但是是异步的
    return stream.switch(() => this.calling$.do()).map((data) => ({
      size: data.size,
    }))
  }

  render() {
    return <div>
      {this.originalName}: {this.state.age}

      <a href="#" onClick$={this.handleStream}>stream</a>
    </div>
  }
}
