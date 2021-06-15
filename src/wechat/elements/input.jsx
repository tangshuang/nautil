import { mixin } from 'ts-fns'
import Input from '../../lib/elements/input.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Input, class {
  render() {
    const { type, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = type === 'number' || type === 'range' ? +value : value
      this.dispatch('Change', e)
    }

    return <input
      {...rest}

      type={type}

      bindchange={onChange}
      bindfocus={e => this.dispatch('Focus', e)}
      bindblur={e => this.dispatch('Blur', e)}
      bindselect={e => this.dispatch('Select', e)}

      style={Style.stringify(this.style)}
    />
  }
})

export { Input }
export default Input
