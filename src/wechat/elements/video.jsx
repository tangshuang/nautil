import { mixin } from 'ts-fns'
import Video from '../../lib/elements/video.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Video, class {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { width, height, ...this.style }
    const src = isString(source) ? source : source.uri
    return (
      <video
        {...rest}

        src={src}

        style={Style.stringify(style)}
        class={this.className}
      >
        {this.children}
      </video>
    )
  }
})

export { Video }
export default Video
