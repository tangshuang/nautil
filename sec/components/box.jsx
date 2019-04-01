import { Component } from 'nautil'
import { StyleSheet } from 'nautil/style-sheet'

// 创建样式表
// 样式表可以通过工具提炼出CSS文件，也可以通过其他方式实现热更新
const BoxStyle = new StyleSheet({
  myClass: {
    color: 'red',
    textAlign: 'left',

    myChildrenClass: new StyleSheet({
      lineHeight: '12px',
    }),
  },
})

export class Box extends Component {

  // 规定接收的props的数据类型，在运行时检查这个数据类型
  // 没有在这里规定的props，不会被接收
  static props = {
    size: Number,
    weight: Number,
    onTouchStart: Function,
  }

  // 规定this.state的初始值。也可以不规定。
  // 当对应的属性不存在于props中的时候，使用该值。
  static state = {
    size: 10,
    weight: 20,
  }

  // this.state是state和props合并后得到的结果，并且双向绑定：
  // 当执行this.state.size ++之后，不仅this.state.size发生了变化，外层传入的size属性所绑定的值也发生了变化
  // 当外层传入的size属性的值发生变化之后，这里的this.state.size也会发生变化，并更新界面

  handleClick = this.handleClick.bind(this)
  handleStream = this.handleStream.bind(this)

  onTouchStart(event) {
    this.state.size ++
    this.state.onTouchStart(event) // 来自props的属性
  }

  updateBatch() {
    // 虽然两次修改了数据，但是只会执行一次重新渲染
    this.state.size ++

    const { size } = this.state // 同步获取最新的size值
    this.state.weight = size * 10
  }

  render() {
    return <div onTouchStart={this.onTouchStart}>
      {this.state.name}
      {this.state.size}
      {this.state.weight}

      <p style={BoxStyle.myClass.myChildrenClass}>My name is ok</p>
    </div>
  }

}

export default Box
