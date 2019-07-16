import { define } from 'nautil/dom'
import { Component } from 'nautil'
import { Button } from 'nautil/components'

class RainbowButton extends Component {

  static props = {
    colors: Array,
    onClick: Function,
  }

  state = {
    index: 0,
  }

  changeColor() {
    const index = parseInt(Math.random() * 10, 10)
    this.setState({ index })
  }

  render() {
    const { colors } = this.attrs
    const { index } = this.state
    const color = colors[index]
    const onHint = (e) => {
      this.changeColor()
      this.props.onClick(e)
    }

    return (
      <Button style={{ backgroundColor: color }} onHint={onHint}>click me</Button>
    )
  }
}

const cssText = `
  button {
    border: 0;
    color: #333;
  }
`

define('rainbow-button', RainbowButton, cssText)
