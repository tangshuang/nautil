import { LanguageDetector } from '../../lib/i18n/language-detector.js'

LanguageDetector.getLang = () => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    wx.getSystemInfo({
      success: (res) => {
        resolve(res.language)
      },
      error: reject,
    })
  })
}

export { LanguageDetector }
export default LanguageDetector
