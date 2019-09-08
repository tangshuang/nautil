import Component from '../core/component.js'

export class Static extends Component {
  shouldUpdate(nextProps) {
    return nextProps.shouldUpdate
  }
  render() {
    return this.children()
  }
}
export default Static
