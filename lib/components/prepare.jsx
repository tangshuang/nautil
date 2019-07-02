import Component from '../core/component.js'
import Fragment from './fragment.jsx'

export class Prepare extends Component {
  render() {
    const { isReady, loadingComponent, children } = this.props
    return isReady ? <Fragment>{children}</Fragment> : loadingComponent
  }
}
