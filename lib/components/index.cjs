const CoreComponents = require('../core-components')
const Components = process.env.RUNTIME_ENV === 'native' ? require('../native-components') : require('../dom-components')

module.exports = {
  ...CoreComponents,
  ...Components,
}
