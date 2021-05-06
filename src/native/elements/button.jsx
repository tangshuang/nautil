import React, { Children } from 'react'
import { mixin } from 'ts-fns'
import { TouchableOpacity } from 'react-native'
import Button from '../../lib/elements/button.jsx'
import Text from '../../lib/elements/text.jsx'

mixin(Button, class {
  render() {
    const children = this.children
    const isPuerText = !Children.toArray(children).some(node => node.type)
    const content = isPuerText ? <Text>{children}</Text> : children

    return (
      <TouchableOpacity
        onPress={e => this.dispatch('Hit', e)}
        onPressIn={e => this.dispatch('HitStart', e)}
        onPressOut={e => this.dispatch('HitEnd', e)}
        style={this.style}
        {...this.attrs}
      >{content}</TouchableOpacity>
    )
  }
})

export { Button }
export default Button
