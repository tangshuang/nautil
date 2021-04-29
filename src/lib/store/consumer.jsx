import { ifexist } from 'tyshemo'

import Component from '../component.js'
import Store from './store.js'

export class _Consumer extends Component {
  static props = {
    store: Store,
    map: ifexist(Function),
    render: ifexist(Function),
  }

  constructor(props) {
    super(props)

    const { store } = props
    store.subscribe((next, prev) => {
      if (next !== prev) {
        this.weakUpdate()
      }
    })

    this._latestState = null
    this._latestRender = null
  }

  render() {
    const { store, map, render } = this.attrs
    const fn = render ? render : this.children
    const state = store.getState()

    if (state === this._latestState) {
      return this._latestRender
    }

    const data = map ? map(store) : store
    this._latestState = state
    this._latestRender = fn(data)
    return this._latestRender
  }
}
export class Consumer extends Component {
  render() {
    return <_Consumer {...this.props} />
  }
}

export default Consumer

export const connect = mapToProps => C => {
  return class ConnectedComponent extends Component {
    render() {
      return (
        <Consumer render={(store) => {
          const data = mapToProps(store)
          const props = { ...this.props, ...data }
          return <C {...props} />
        }} />
      )
    }
  }
}

export function useStore(store) {
  const [, update] = useState()
  useEffect(() => {
    const forceUpdate = () => {
      update({})
    }
    store.subscribe(forceUpdate)
    return () => store.unsubscribe(forceUpdate)
  }, [])
  return store
}