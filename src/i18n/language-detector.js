let LanguageDetector

if (process.env.RUNTIME_ENV === 'react-native') {
  LanguageDetector = require('i18next-react-native-language-detector').default
}
else if (process.env.RUNTIME_ENV === 'ssr-server') {
  LanguageDetector = {}
}
else if (process.env.RUNTIME_ENV === 'ssr-client') {
  LanguageDetector = {
    // type: 'languageDetector',
    // async: true,
    // init() {},
    // detect(setLng) {
    //   const lng = window.__language
    //   const l = lng || localStorage.getItem('i18nextLng')
    //   setLng(l)
    // },
    // cacheUserLanguage(lng) {
    //   localStorage.setItem('i18nextLng', lng)
    // },
  }
}
else {
  LanguageDetector = require('i18next-browser-languagedetector').default
}

export { LanguageDetector }
