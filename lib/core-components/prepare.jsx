import Component from '../core/component.js'

export class Prepare extends Component {
  render() {
    const { isReady, loadingComponent, children } = this.attrs
    return isReady ? children : loadingComponent ? loadingComponent : null
  }
}
export default Prepare
