import { Component, Section } from 'nautil'
import { Enum } from 'nautil/types'
import { Router, Switch } from 'nautil/router'
import Box from './components/box.jsx'

class Home extends Component {
  static props = ['text']

  render() {
    return <h1>{this.state.text}</h1>
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

  // Section创建一个空标签区域
  // 使用路由
  render() {
    return <Section>
      <Router mode="history" base="/app">
        <Switch path="/" exact>
          <Home text="Home"></Home>
        </Switch>
        <Switch path="/color" animation-enter="slideLeft fadeIn" animation-leave="slideLeft fadeOut">
          <p>Color: {this.state.color}</p>
        </Switch>
        <Switch path="/box">
          <Box size={this.state.size} weight={this.state.weight} onTouchStart={this.handleFn}></Box>
        </Switch>
      </Router>
    </Section>
  }
}

export default App
