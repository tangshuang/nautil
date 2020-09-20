import React from 'react'
import { mixin, isString } from 'ts-fns'
import Image from '../../lib/elements/image.jsx'

mixin(Image, class {
  render() {
    const { source, width, height, maxWidth, maxHeight, ...rest } = this.attrs
    const style = { width, height, maxWidth, maxHeight, ...this.style }
    const className = this.className
    const children = this.children
    const src = isString(source) ? source : source.uri

    // use image as background
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
})

export { Image }
export default Image
