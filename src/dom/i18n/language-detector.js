import { LanguageDetector } from '../../lib/i18n/language-detector.js'
import { mixin } from 'ts-fns'
import BrowserLanguageDetector from 'i18next-browser-languagedetector'

mixin(LanguageDetector, class {
  getDetector() {
    return BrowserLanguageDetector
  }
})

export { LanguageDetector }
export default LanguageDetector
