import { Component, View } from 'nautil'
import { Enum } from 'nautil/types'
import { Router, Switch } from 'nautil/router'
import Box from './components/Box.js'

// 纯函数式组件
function Home(props) {
  return <h1>{props.text}</h1>
}

export class App extends Component {
  static props = {
    weight: Number,
    size: Number,
    color: Enum('red', 'blue', 'yellow'),
  }
  static defaults = {
    weight: 10,
    size: 10,
    color: 'red',
  }

  handleFn(...args) {
    // 被传入Box内部使用
  }

  // View创建一个空标签区域
  // 使用路由
  render() {
    return <View>
      <Router mode="history" base="/app">
        <Switch path="/" exact>
          <Home text="Home"></Home>
        </Switch>
        <Switch path="/color" animation-enter="slideLeft fadeIn" animation-leave="slideLeft fadeOut">
          <p>Color: {this.state.color}</p>
        </Switch>
        <Switch path="/box">
          <Box size={this.state.size} weight={this.state.weight} onTouch={this.handleFn}></Box>
        </Switch>
      </Router>
    </View>
  }
}

export default App
