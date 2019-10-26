import Component from '../core/component.js'
import { enumerate, Unit } from '../core/types.js'
import { noop, isString } from '../core/utils.js'

export class Audio extends Component {
  static props = {
    source: enumerate([String, Object]),
    width: Unit,
    height: Unit,
  }
  static defaultProps = {
    width: '100%',
    height: 90,

    onPlay: noop,
    onPause: noop,
    onStop: noop,
    onDrag: noop,
    onResume: noop,
    onReload: noop,
    onLoad: noop,
    onTick: noop,
    onVolume: noop,
  }
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { width, height, ...this.style }
    const src = isString(source) ? source : source.uri
    return (
      <audio {...rest} src={src} style={style} className={this.className}>
        {this.children}
      </audio>
    )
  }
}
export default Audio
