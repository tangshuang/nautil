import Component from '../core/component.js'
import { isString } from '../core/utils.js'

export class Image extends Component {
  render() {
    const { source, width, height, maxWidth, maxHeight, ...rest } = this.attrs
    const style = { ...this.style, width, height, maxWidth, maxHeight }
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
