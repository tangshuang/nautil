import Component from '../core/component.js'

export class Radio extends Component {
  render() {
    const { checked, ...rest } = this.attrs
    const { $checked } = this.props

    const onChange = (e) => {
      if ($checked) {
        this.attrs.checked = !checked
      }

      if (checked) {
        this.onUncheck$.next(e)
      }
      else {
        this.onCheck$.next(e)
      }
    }

    return <input type="radio"
      {...rest}

      checked={checked}
      onChange={onChange}

      className={this.className}
      style={this.style}
    />
  }
}
export default Radio
