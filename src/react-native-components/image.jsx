import Component from '../core/component.js'
import { Image as NativeImage, ImageBackground } from 'react-native'
import { enumerate, ifexist, Unit } from '../types.js'
import { noop } from '../utils.js'

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
    const styles = { ...this.style, width, height, maxWidth, maxHeight }
    const children = this.children

    if (children) {
      return <ImageBackground source={source} style={styles} {...rest}>{children}</ImageBackground>
    }
    else {
      return <NativeImage source={source} style={styles} {...rest} />
    }
  }
}
export default Image

// TODO: use image as background
