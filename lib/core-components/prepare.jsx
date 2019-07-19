import Component from '../core/component.js'

export class Prepare extends Component {
  render() {
    const { isReady, loadingComponent } = this.attrs
    return isReady ? this.children : loadingComponent ? loadingComponent : null
  }
}
export default Prepare
