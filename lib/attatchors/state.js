import Store from '../core/store.js'

export function attachState(state) {
  return $this => {
    const $store = new Store(state)
    $store.watch('*', $this.update)
    this.$state = $store.state
  }
}
export default attachState