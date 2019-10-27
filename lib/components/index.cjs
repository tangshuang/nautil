if (process.env.RUNTIME_ENV === 'native') {
  module.exports = require('../native-components')
}
else {
  module.exports = require('../dom-components')
}
