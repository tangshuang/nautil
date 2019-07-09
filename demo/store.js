import { Store } from 'nautil'
import depo from './depo.js'

const store = new Store({
  name: 'tomy',
  age: 10,
  info: {},
})

depo.autorun(function() {
  const data = depo.get('info')
  store.state.info = data || {}
})

export default store
