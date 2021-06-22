import { isString, mixin, isNumeric } from 'ts-fns'
import Style from '../../lib/style/style.js'
import { StyleSheet, PixelRatio, Dimensions } from 'react-native'

const { create } = Style

mixin(Style, class {
  static filter(key) {
    if (['transition', 'animation'].includes(key)) {
      return false
    }
    return true
  }
  static convert(value) {
    if (isString(value) && value.indexOf('rem') > 0) {
      const size = parseInt(value, 10)
      return PixelRatio.get() <= 2 ? 1.4 * size : 1.8 * size
    }
    if (isString(value) && value.indexOf('em') > 0) {
      const size = parseInt(value, 10)
      return PixelRatio.get() <= 2 ? 14 * size : 18 * size
    }
    if (isString(value) && value.indexOf('px') > 0) {
      return parseInt(value, 10)
    }
    if (isString(value) && value.indexOf('vw') > 0) {
      return vw(parseInt(value, 10))
    }
    if (isString(value) && value.indexOf('vh') > 0) {
      return vh(parseInt(value, 10))
    }
    if (isNumeric(value)) {
      return +value
    }
    return value
  }
  static create(stylesheet) {
    const rules = create(stylesheet)
    const styles = StyleSheet.create({ rules })
    return styles.rules
  }
})

// fork https://github.com/graftonstudio/react-native-css-vh-vw/blob/master/src/index.js
function vh(percentage) {
  const viewportHeight = Dimensions.get('window').height;
  const decimal = percentage * .01;
  percentage = parseInt(percentage, 10);

  // Hard limits
  if (percentage < 0) {
    percentage = 100;
  }
  if (percentage > 1000) {
    percentage = 1000;
  }

  return Math.round(viewportHeight * decimal);
}
function vw(percentage) {
  const viewportWidth = Dimensions.get('window').width;
  const decimal = percentage * .01;
  percentage = parseInt(percentage, 10);

  // Hard limits
  if (percentage < 0) {
    percentage = 100;
  }
  if (percentage > 1000) {
    percentage = 1000;
  }

  return Math.round(viewportWidth * decimal);
}

export { Style }
export default Style
