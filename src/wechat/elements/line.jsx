import { mixin } from 'ts-fns'
import { Line } from '../../lib/elements/line.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Line, class {
  render() {
    const { width, thick, color, ...rest } = this.attrs
    const styles = { display: 'block', borderBottom: `${thick}px solid ${color}`, width, height: 0, ...this.style }
    return <view {...rest} class={this.className} style={Style.stringify(styles)} />
  }
})

export { Line }
export default Line
