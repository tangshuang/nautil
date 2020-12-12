import React, { Children } from 'react'
import { mixin } from 'ts-fns'
import { View } from 'react-native'
import Section from '../../lib/elements/section.jsx'
import Text from '../../lib/elements/text.jsx'

mixin(Section, class {
  render() {
    const { pointerEvents } = this.style

    const children = this.children
    const isPuerText = !Children.toArray(children).some(node => node.type)
    const content = isPuerText ? <Text>{children}</Text> : children

    return (
      <View
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={e => this.emit('HitStart', e)}
        onResponderMove={e => this.emit('HitMove', e)}
        onResponderRelease={e => this.emit('HitEnd', e)}
        onResponderReject={e => this.emit('HitCancel', e)}
        onResponderTerminate={e => this.emit('HitCancel', e)}

        className={this.className}
        style={this.style}
        pointerEvents={pointerEvents}

        {...this.attrs}
      >{content}</View>
    )
  }
})

export { Section }
export default Section
