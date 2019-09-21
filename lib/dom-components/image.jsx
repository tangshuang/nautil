import Component from '../core/component.js'
import { enumerate, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Image extends Component {
  static props = {
    source: enumerate([ String, Object ]),
    width: Number,
    height: Number,
    maxWidth: ifexist(Number),
    maxHeight: ifexist(Number),
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,

    onLoad: noop,
  }
  render() {
    const {
      className,
      style,
      attrs,
      children,
    } = this
    var { source, width, height, maxWidth, maxHeight, ...props } = attrs

    width = width === Infinity ? 'auto' : width
    height = height === Infinity ? 'auto' : height

    const styles = { width, height, maxWidth, maxHeight, ...style }

    return children ? <div {...props} className={className} style={{
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      ...styles,
      backgroundImage: `url(${source})`,
    }}>{children}</div> : <img {...props} src={source} className={className} style={styles} />
  }
}
export default Image

// TODO: use image as background
