import Component from '../core/component.js'
import { enumerate, ifexist, Unit } from '../types.js'
import { noop, isString } from '../utils.js'

export class Image extends Component {
  static props = {
    source: enumerate([String, Object]),
    width: Unit,
    height: Unit,
    maxWidth: ifexist(Unit),
    maxHeight: ifexist(Unit),
  }
  static defaultProps = {
    width: '100%',
    height: 'auto',

    onLoad: noop,
  }
  render() {
    const { source, width, height, maxWidth, maxHeight, ...rest } = this.attrs
    const style = { width, height, maxWidth, maxHeight, ...this.style }
    const className = this.className
    const children = this.children
    const src = isString(source) ? source : source.uri

    if (children) {
      return (
        <div
          {...rest}
          className={className}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            ...style,
            backgroundImage: `url(${src})`,
          }}
        >{children}</div>
      )
    }
    else {
      return <img {...rest} src={src} className={className} style={style} />
    }
  }
}
export default Image

// TODO: use image as background
