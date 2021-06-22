import { mixin } from 'ts-fns'
import Css from '../../lib/style/css.js'
import { StyleSheet } from 'react-native'

const { create } = Css

mixin(Css, class {
  static create(css) {
    const selectors = create(css)
    const styles = StyleSheet.create({ selectors })
    return styles.selectors
  }
})

export { Css }
export default Css
