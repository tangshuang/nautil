import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

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

    return <button
      onClick={e => onHint$.next(e)}
      onMouseEnter={e => onHintEnter$.next(e)}
      onMouseDown={e => onHintStart$.next(e)}
      onMouseMove={e => onHintMove$.next(e)}
      onMouseUp={e => onHintEnd$.next(e)}
      onMouseLeave={e => onHintLeave$.next(e)}

      onTouchStart={e => onHintStart$.next(e)}
      onTouchMove={e => onHintMove$.next(e)}
      onTouchEnd={e => onHintEnd$.next(e)}

      className={className}
      style={style}

      {...attrs}>{children}</button>
  }
}
export default Button
