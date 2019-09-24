import Component from '../core/component.js'

export class Checkbox extends Component {
  render() {
    const { checked, ...rest } = this.attrs
    const { $checked } = this.props

    const onChange = (e) => {
      if ($checked) {
        this.attrs.checked = !checked
      }

      if (checked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <input type="checkbox"
      {...rest}

      checked={checked}
      onChange={onChange}

      className={className}
      style={style}
    />
  }
}
export default Checkbox
