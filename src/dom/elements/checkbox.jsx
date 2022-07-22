import { Checkbox } from '../../lib/elements/checkbox.jsx'

Checkbox.implement(class {
  render() {
    const { checked, ...rest } = this.attrs

    const onChange = (e) => {
      this.$attrs.checked = !checked

      if (checked) {
        this.dispatch('Uncheck', e)
      }
      else {
        this.dispatch('Check', e)
      }

      this.dispatch('Change', e)
    }

    return <input type="checkbox"
      {...rest}

      checked={checked}
      onChange={onChange}

      className={this.className}
      style={this.style}
    />
  }
})

export { Checkbox }
export default Checkbox
