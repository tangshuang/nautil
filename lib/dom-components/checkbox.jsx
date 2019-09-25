import Component from '../core/component.js'

export class Checkbox extends Component {
  render() {
    const { checked, ...rest } = this.attrs

    const onChange = (e) => {
      this.attrs.checked = !checked

      if (checked) {
        this.onUncheck$.next(e)
      }
      else {
        this.onCheck$.next(e)
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
