import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'
import { View } from 'react-native'

export class Section extends Component {
  static defaultProps = {
    onHint: noop,
    onHintEnter: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
    onHintLeave: noop,
  }
  render() {
    const {
      onHint$,
      onHintEnter$,
      onHintStart$,
      onHintMove$,
      onHintEnd$,
      onHintLeave$,

      className,
      style,
      attrs,
      children,
    } = this

    const { pointerEvents } = style

    return <View
      onResponderGrant={e => onHintStart$.next(e)}
      onResponderMove={e => onHintMove$.next(e)}
      onResponderRelease={e => {
        onHintEnd$.next(e)
        onHint$.next(e)
      }}

      className={className}
      style={style}
      pointerEvents={pointerEvents}

      {...attrs}>{children}</View>
  }
}
export default Section
