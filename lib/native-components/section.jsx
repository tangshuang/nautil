import { Component } from '../core/component.js'
import { View } from 'react-native'
import { Text } from '../components/index.js'
import { filterChildren } from '../core/utils.js'
import { noop } from '../core/utils.js'

export class Section extends Component {
  static defaultProps = {
    onHint: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
    onHintCancel: noop,
  }
  render() {
    const { pointerEvents } = this.style

    const children = this.children
    const nodes = filterChildren(children)
    const isPuerText = !nodes.some(node => node.type)
    const content = isPuerText ? <Text>{children}</Text> : children

    return <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={e => this.onHintStart$.next(e)}
      onResponderMove={e => this.onHintMove$.next(e)}
      onResponderRelease={e => this.onHintEnd$.next(e)}
      onResponderReject={e => this.onHintCancel$.next(e)}
      onResponderTerminate={e => this.onHintCancel$.next(e)}

      className={this.className}
      style={this.style}
      pointerEvents={pointerEvents}

      {...this.attrs}
    >{content}</View>
  }
}

export default Section
