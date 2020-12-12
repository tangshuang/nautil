import { ifexist } from 'tyshemo'

import Component from '../component.js'
import Store from './store.js'

export class _Consumer extends Component {
  static props = {
    store: Store,
    render: ifexist(Function),
  }

  constructor(props) {
    super(props)

    const { store } = props
    store.subscribe((next, prev) => {
      if (next !== prev) {
        this.update()
      }
    })

    this._latestState = null
    this._latestRender = null
  }

  render() {
    const { store, render } = this.attrs
    const fn = render ? render : this.children
    const state = store.getState()
    const dispatch = (update) => store.dispatch(update)

    if (state === this._latestState) {
      return this._latestRender
    }

    this._latestState = state
    this._latestRender = fn({
      state,
      dispatch,
    })
    return this._latestRender
  }
}
export class Consumer extends Component {
  render() {
    return <_Consumer {...this.props} />
  }
}

export default Consumer
