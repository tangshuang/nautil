import { Store } from '../../src/index.js'
import * as home from './modules/home/home.store.js'

export const store = new Store({
  home,
})

export default store
