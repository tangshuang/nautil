import Component from '../core/component.js'

export class Video extends Component {
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
}
export default Video
