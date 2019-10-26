import { Component } from '../core/component.js'
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
    const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)
    return <div
      onClick={e => this.onHint$.next(e)}

      onMouseDown={e => !isTouchable &&this.onHintStart$.next(e)}
      onMouseMove={e => !isTouchable &&this.onHintMove$.next(e)}
      onMouseUp={e => !isTouchable &&this.onHintEnd$.next(e)}

      onTouchStart={e => isTouchable &&this.onHintStart$.next(e)}
      onTouchMove={e => isTouchable && this.onHintMove$.next(e)}
      onTouchEnd={e => isTouchable && this.onHintEnd$.next(e)}
      onTouchCancel={e => isTouchable && this.onHintCancel$.next(e)}

      className={this.className}
      style={this.style}

      {...this.attrs}
    >{this.children}</div>
  }
}
export default Section
