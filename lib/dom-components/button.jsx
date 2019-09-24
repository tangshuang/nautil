import { Component } from '../core/component.js'

export class Button extends Component {
  render() {
    const isTouchable = ('ontouchmove' in document)
    return <button
      onClick={e => this.onHint$.next(e)}

      onMouseDown={e => !isTouchable &&this.onHintStart$.next(e)}
      onMouseUp={e => !isTouchable &&this.onHintEnd$.next(e)}

      onTouchStart={e => isTouchable &&this.onHintStart$.next(e)}
      onTouchEnd={e => isTouchable && this.onHintEnd$.next(e)}

      className={this.className}
      style={this.style}

      {...this.attrs}
    >{this.children}</button>
  }
}
export default Button
