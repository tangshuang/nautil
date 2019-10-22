import Component from '../core/component.js'
import { isString } from '../core/utils.js'

export class Audio extends Component {
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
}
export default Audio
