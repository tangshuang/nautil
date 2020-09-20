import React from 'react'
import { mixin } from 'ts-fns'
import { View } from 'react-native'
import Line from '../../lib/elements/line.jsx'

mixin(Line, class {
  render() {
    const { width, thick, color = '#888888', ...rest } = this.attrs
    const styles = { width, height: 0, borderBottomColor: color, borderBottomWidth: thick, ...this.style }
    return <View {...rest} style={styles}></View>
  }
})

export { Line }
export default Line
