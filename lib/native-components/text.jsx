import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'
import { Text as NativeText } from 'react-native'

export class Text extends Component {
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

    return <NativeText
      onPress={e => onHintEnd$.next(e)}

      className={className}
      style={style}

      {...attrs}>{children}</NativeText>
  }
}
export default Text
