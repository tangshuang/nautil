import { Children } from 'react'
import { isString } from 'ts-fns'
import { Image as NativeImage, ImageBackground } from 'react-native'
import { Image } from '../../lib/elements/image.jsx'

Image.implement(class {
  render() {
    const { source, width, height, maxWidth, maxHeight, ...rest } = this.attrs
    const styles = { ...this.style, width, height, maxWidth, maxHeight }
    const children = this.children
    const src = isString(source) ? { uri: source } : source

    if (Children.count(children)) {
      return <ImageBackground source={src} style={styles} {...rest}>{children}</ImageBackground>
    }
    else {
      return <NativeImage source={src} style={styles} {...rest} />
    }
  }
})

export { Image }
export default Image
