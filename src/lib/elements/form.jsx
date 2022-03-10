import Component from '../core/component.js'

export class Form extends Component {
  static props = {
    onChange: false,
    onReset: false,
    onSubmit: false,
  }
}
export default Form
