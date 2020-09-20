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
        onPress={e => this.emit('Hint', e)}
        onPressIn={e => this.emit('HintStart', e)}
        onPressOut={e => this.emit('HintEnd', e)}
        style={this.style}
        {...this.attrs}
      >{content}</TouchableOpacity>
    )
  }
})

export { Button }
export default Button
