import { mixin } from 'ts-fns'
import Line from '../../lib/elements/line.jsx'

mixin(Line, class {
  render() {
    const { width, thick, color, ...rest } = this.attrs
    const styles = { display: 'block', borderBottom: `${thick}px solid ${color}`, width, height: 0, ...this.style }
    return <div {...rest} className={this.className} style={styles}></div>
  }
})

export { Line }
export default Line
