import Component from '../component.js'

export class Radio extends Component {
  static props = {
    checked: Boolean,
    onCheck: false,
    onUncheck: false,
    onChange: false,
  }
  static defaultProps = {
    checked: false,
  }
}
export default Radio
