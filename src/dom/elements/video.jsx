import { isString } from 'ts-fns'
import { Video } from '../../lib/elements/video.jsx'

Video.implement(class {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { width, height, ...this.style }
    const src = isString(source) ? source : source.uri
    return (
      <video {...rest} src={src} style={style} className={this.className}>
        {this.children}
      </video>
    )
  }
})

export { Video }
export default Video
