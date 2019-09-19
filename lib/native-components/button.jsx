import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'
import { Button as NativeButton } from 'react-native'

export class Button extends Component {
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

    const { color } = style

    return <NativeButton
      onPress={e => onHintEnd$.next(e)}

      className={className}
      style={style}
      color={color}

      {...attrs}>{children}</NativeButton>
  }
}
export default Button
