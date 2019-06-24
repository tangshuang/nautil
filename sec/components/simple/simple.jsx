import { Component, Ajax } from 'nautil'

export class Simple extends Component {
  static props = ['name', 'age'] // 如果不需要对props进行类型检查，只需要传入一个数组即可

  // 用nautil内置的Ajax方法创建一个用于请求数据的ajax流
  calling$ = new Ajax({
    mode: 'switch',
    url: 'xxx',
    header: 'xxx',
  })

  // 使用最原始的值，下次修改originalName时，不会对state产生影响
  originalName = this.state.name

  handleStream() {
    // 基于stream更新数据，用于异步数据修改的情况
    this.calling$
      .get()
      .map((data) => ({
        size: data.size,
      }))
      .subscribe((state) => {
        this.state.$update(state)
      })
  }


  // this.children是引用传入的内部组件
  // 还可以通过给组件设置key来调用 {this.children[key]}
  render() {
    return <div>
      {this.originalName}: {this.state.age}

      {this.children}

      <a href="#" onClick={this.handleStream}>stream</a>
    </div>
  }
}
