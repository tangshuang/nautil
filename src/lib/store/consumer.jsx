import { ifexist } from 'tyshemo'

import Component from '../core/component.js'
import Store from './store.js'

export class Consumer extends Component {
  static props = {
    store: Store,
    name: ifexist(String),
    render: ifexist(Function),
  }

  constructor(props) {
    super(props)

    const { store, name = '' } = props
    store.subscribe((state, latest) => {
      const next = name ? state[name] : next
      const prev = name ? latest[name] : latest
      if (next !== prev) {
        this.update()
      }
    })

    this._prevState = null
    this._prevRender = null
  }

  render() {
    const { store, name, render } = this.attrs
    const fn = render ? render : this.children
    const { state, dispatch } = store

    const scopedState = name ? state[name] : state
    const scopedDispatch = name ? dispatch[name] : dispatch
    if (scopedState === this._prevState) {
      return this._prevRender
    }

    this._prevState = scopedState
    this._prevRender = fn({
      state: scopedState,
      dispatch: scopedDispatch,
    })
    return this._prevRender
  }
}
export default Consumer
