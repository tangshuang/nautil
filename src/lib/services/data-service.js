import { Service } from '../service.js'
import { Ty, Enum, List, ifexist } from 'tyshemo'
import { Store } from '../store/store.js'
import { getObjectHash, isEqual, debounce } from 'ts-fns'

const CELL_TYPES = {
  SOURCE: 1,
  COMPOSE: 2,
}

export class DataService extends Service {
  _subscribers = []

  _isGettingComposeValue = false

  _hostsChain = []
  _hooksChain = []

  source(get, value) {
    const cell = {
      type: CELL_TYPES.SOURCE,
      get,
      value,
      atoms: [],
    }
    return cell
  }

  compose(get) {
    this._isGettingComposeValue = true
    const value = get.call(this)
    this._isGettingComposeValue = false
    const cell = {
      type: CELL_TYPES.COMPOSE,
      get,
      atoms: [],
      value,
    }
    return cell
  }

  query(cell, ...params) {
    const { type, value } = cell
    if (this._isGettingComposeValue) {
      return [value, () => { throw new Error('refetch in compose directly is not allowed.') }]
    }
    else if (type === CELL_TYPES.SOURCE) {
      return this._querySource(cell, ...params)
    }
    else if (type === CELL_TYPES.COMPOSE) {
      return this._queryCompose(cell, ...params)
    }
  }

  _querySource(cell, ...params) {
    const { atoms, value, get } = cell
    const hash = getObjectHash(params)
    const atom = atoms.find(item => item.hash === hash)

    if (atom) {
      return 'value' in atom ? [atom.value, atom.next] : [value, atom.next]
    }

    const next = debounce(() => {
      const atom = atoms.find(item => item.hash === hash)
      if (atom.deferer) {
        return
      }

      atom.deferer = Promise.resolve().then(() => get.call(this, ...params)).then((value) => {
        atom.value = value
        this._dispatch(cell, params, value)
        // reset
        atom.deferer = null
        // recompute
        atom.hosts.forEach((host, i) => {
          if (host.end) { // the host is destoryed
            atom.hosts.splice(i, 1)
          }
          else {
            host.next()
          }
        })
      })
    }, 64)

    const item = atom || { hash, params, next, hosts: [], cell }
    const host = this._hostsChain[this._hostsChain.length - 1]

    if (!atom) {
      atoms.push(item)
    }

    if (host) {
      host.deps.push(item)
      item.hosts.push(host)
    }

    next()

    return [value, next]
  }

  _queryCompose(cell, ...params) {
    const { atoms, get } = cell
    const hash = getObjectHash(params)
    const atom = atoms.find(item => item.hash === hash)

    if (atom) {
      return [atom.value, atom.emit]
    }

    const compute = (atom) => {
      this._hostsChain.push(atom)
      const value = get.call(this, ...params)
      atom.value = value
      this._hostsChain.pop()
      this._hostsChain.length = 0 // clear hooks list
      return value
    }

    const next = debounce(() => {
      const atom = atoms.find(item => item.hash === hash)
      const value = compute(atom)
      this._dispatch(cell, params, value)
      // recompute
      atom.hosts.forEach((host, i) => {
        if (host.end) { // the host is destoryed
          atom.hosts.splice(i, 1)
        }
        else {
          host.next()
        }
      })
    }, 64)

    const emit = (...cells) => {
      const atom = atoms.find(item => item.hash === hash)
      // host will recompute/popagate in dep.next, so we do not need to do `next` any more
      const deps = cells.length ? atom.deps.filter(dep => cells.includes(dep.cell)) : atom.deps
      deps.map(dep => dep.next())
    }

    const item = atom || { hash, params, next, emit, deps: [], hosts: [], hooks: [], cell }
    const host = this._hostsChain[this._hostsChain.length - 1]

    if (!atom) {
      atoms.push(item)
    }

    compute(item)

    if (host) {
      host.deps.push(item)
      item.hosts.push(host)
    }

    return [item.value, emit]
  }

  subscribe(fn) {
    this._subscribers.push(fn)
  }

  unsubscribe(fn) {
    this._subscribers.forEach((item, i) => {
      if (item === fn) {
        this._subscribers.splice(i, 1)
      }
    })
  }

  _dispatch(cell, params, value) {
    this._subscribers.forEach((callback) => {
      callback(cell, params, value)
    })
  }
}
