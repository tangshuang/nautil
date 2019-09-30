import { Component } from '../core/component.js'
import { Text as NativeText } from 'react-native'

export class Text extends Component {
  render() {
    return <NativeText
      onPress={e => this.onHint$.next(e)}

      onResponderGrant={e => this.onHintStart$.next(e)}
      onResponderMove={e => this.onHintMove$.next(e)}
      onResponderRelease={e => this.onHintEnd$.next(e)}
      onResponderReject={e => this.onHintCancel$.next(e)}
      onResponderTerminate={e => this.onHintCancel$.next(e)}

      className={this.className}
      style={this.style}

      {...this.attrs}
    >{this.children}</NativeText>
  }
}
export default Text
