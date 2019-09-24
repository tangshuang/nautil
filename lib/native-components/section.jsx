import { Component } from '../core/component.js'
import { View } from 'react-native'

export class Section extends Component {
  render() {
    const { pointerEvents } = this.style

    return <View
      onResponderGrant={e => this.onHintStart$.next(e)}
      onResponderMove={e => this.onHintMove$.next(e)}
      onResponderRelease={e => {
        this.onHintEnd$.next(e)
        this.onHint$.next(e)
      }}

      className={this.className}
      style={this.style}
      pointerEvents={pointerEvents}

      {...this.attrs}
    >{this.children}</View>
  }
}

export default Section
