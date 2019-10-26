if (process.env.RUNTIME_ENV === 'native') {
  module.exports = require('i18next-react-native-language-detector')
}
else if (process.env.RUNTIME_ENV !== 'ssr') {
  module.exports = {}
}
else {
  module.exports = require('i18next-browser-languagedetector')
}
