import { mixin, isString } from 'ts-fns'
import Image from '../../lib/elements/image.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Image, class {
  render() {
    const { source, width, height, maxWidth, maxHeight, ...rest } = this.attrs
    const style = { width, height, maxWidth, maxHeight, ...this.style }
    const children = this.children
    const src = isString(source) ? source : source.uri

    // use image as background
    if (children) {
      return (
        <view
          {...rest}
          style={Style.stringify({
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            ...style,
            backgroundImage: `url(${src})`,
          })}
        >{children}</view>
      )
    }
    else {
      return (
        <image
          {...rest}
          src={src}
          style={Style.stringify(style)}
        />
      )
    }
  }
})

export { Image }
export default Image
