import { Store } from '../../src/index.js'
import * as Home from './modules/home/home.store.js'

export const store = new Store({
  Home,
})

export default store
