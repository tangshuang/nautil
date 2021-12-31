import { LanguageDetector } from '../../lib/i18n/language-detector.js'

LanguageDetector.getLang = () => {
  return new Promise((resolve, reject) => {
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
