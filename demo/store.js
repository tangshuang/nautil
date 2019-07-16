import { Store, createContext } from 'nautil'
import depo from './depo.js'

export const store = new Store({
  name: 'tomy',
  age: 10,
  info: {},
})

depo.autorun(function() {
  const data = depo.get('info')
  store.state.info = data || {}
})

export default store

export const storeContext = createContext(store)
