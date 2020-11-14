import { LanguageDetector } from '../../lib/i18n/language-detector.js'
import { mixin } from 'ts-fns'
import RNLanguageDetector from 'i18next-react-native-language-detector'

mixin(LanguageDetector, class {
  getDetector() {
    return RNLanguageDetector
  }
})

export { LanguageDetector }
export default LanguageDetector
