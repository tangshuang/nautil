import { isString, mixin } from 'ts-fns'
import Audio from '../../lib/elements/audio.jsx'

mixin(Audio, class {
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
})

export { Audio }
export default Audio
