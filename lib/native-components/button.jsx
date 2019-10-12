import { Component } from '../core/component.js'
import Text from '../components/text.jsx'
import { TouchableOpacity } from 'react-native'
import { filterChildren } from '../core/utils.js'

export class Button extends Component {
  render() {
    const children = this.children
    const nodes = filterChildren(children)
    const isPuerText = !nodes.some(node => node.type)
    const content = isPuerText ? <Text>{children}</Text> : children

    return (
      <TouchableOpacity
        onPress={e => this.onHint$.next(e)}
        onPressIn={e => this.onHintStart$.next(e)}
        onPressOut={e => this.onHintEnd$.next(e)}
        style={this.style}
        {...this.attrs}
      >{content}</TouchableOpacity>
    )
  }
}
export default Button
