import { Component, View } from 'nautil'
import { Enum } from 'nautil/types'
import { Router, Switch } from 'nautil/router'
import Box from './components/box.jsx'

class Home extends Component {
  render() {
    return <h1>{this.children}</h1>
  }
}

export class App extends Component {
  static props = {
    weight: Number,
    size: Number,
    color: Enum('red', 'blue', 'yellow'),
  }
  static state = {
    weight: 10,
    size: 10,
    color: 'red',
  }

  handleFn(...args) {
    // 被传入Box内部使用
  }

  // View创建一个空标签区域，View不会产生任何html标签，但是又可以作为一个容器
  // 使用路由
  render() {
    return <View>
      <Router mode="history" base="/app">
        <Switch path="/" exact>
          <Home>Title</Home>
        </Switch>
        <Switch path="/color" animation-enter="slideLeft fadeIn" animation-leave="slideLeft fadeOut">
          <p>Color: {this.state.color}</p>
        </Switch>
        <Switch path="/box">
          <Box size={this.state.size} weight={this.state.weight} onTouchStart={this.handleFn}></Box>
        </Switch>
      </Router>
    </View>
  }
}

export default App
