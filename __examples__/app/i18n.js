import { I18n } from 'nautil/i18n'
import LanguageDetector from 'i18next-browser-languagedetector'

export const i18n = new I18n({
  fallbackLng: 'en-US',
  // debug: true,
  defaultNS: 'common',
  resources: {
    'en-US': {
      "common": {
        "welcome": "Welcome to Nautil's world! 😊",
        "name": "Name",
        "age": "Age",
        "time": "Time",
        "notFound": "Not Found",
        "home": "Home",
        "changeLanguage": "Change Language"
      }
    },
    'zh-CN': {
      "common": {
        "welcome": "欢迎来到 Nautil 的世界！ 😊",
        "name": "姓名",
        "age": "年龄",
        "time": "时间",
        "notFound": "未找到页面",
        "home": "首页",
        "changeLanguage": "切换语言"
      },
    },
  },
  use(i18next) {
    i18next.use(LanguageDetector)
  },
})

export default i18n
