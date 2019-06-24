import { Component } from 'nautil'
import { Section } from 'nautil/components'
import Styles from './box.jss'

export class Box extends Component {
  constructor(props) {
    super(props)

    this.state = {
      weight: 20,
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.updateBatch = this.updateBatch.bind(this)
  }


  onTouchStart(stream) {
    this.props.size ++
    return this.props.onTouchStart(stream) // 来自props的属性
  }

  updateBatch() {
    // 虽然两次修改了数据，但是只会执行一次重新渲染
    this.state.size ++

    const { size } = this.state // 同步获取最新的size值
    this.state.weight = size * 10
  }

  render() {
    return <Section onHintStart={this.onTouchStart}>
      <Section stylesheet={[Styles.text, Styles.name]} $store={this.$store}>
        <Text>My name is ok</Text>
      </Section>
    </Section>
  }

}

export default Box
