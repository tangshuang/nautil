import React, { Children, createRef } from 'react'
import { mixin } from 'ts-fns'
import { View } from 'react-native'
import Section from '../../lib/elements/section.jsx'
import Text from '../../lib/elements/text.jsx'

let activePath = []
let activeNode = null
let capturePath = []

mixin(Section, class {
  onMouted() {
    this.__mounted = true
  }
  onUnmount() {
    this.__mounted = false
  }
  isPathOutsidePath(capturePath, activePath) {
    for (let i = 0, len = activePath.length; i < len; i ++) {
      const active = activePath[i]
      const capture = capturePath[i]
      if (active !== capture) {
        return false
      }
    }
    return true
  }
  render() {
    const { pointerEvents } = this.style

    const children = this.children
    const isPuerText = !Children.toArray(children).some(node => node.type)
    const content = isPuerText ? <Text>{children}</Text> : children

    /**
     * hitOutside https://www.jianshu.com/p/98e0b21473be
     */

    return (
      <View
        {...this.attrs}

        onStartShouldSetResponderCapture={(e) => {
          const nodeId = e.target
          capturePath.push(nodeId)
          return false
        }}
        onStartShouldSetResponder={(e) => {
          if (this.isPathOutsidePath(capturePath, activePath) && activeNode.__mounted) {
            activeNode.emit('HitOutside', e)
          }

          activeNode = this
          activePath = capturePath
          capturePath = []
          return true
        }}

        onResponderStart={e => this.emit('HitStart', e)}
        onResponderMove={e => this.emit('HitMove', e)}
        onResponderRelease={e => this.emit('HitEnd', e)}
        onResponderEnd={e => this.emit('Hit', e)}
        onResponderTerminate={e => this.emit('HitCancel', e)}

        style={this.style}
        pointerEvents={pointerEvents}
      >{content}</View>
    )
  }
})

export { Section }
export default Section
