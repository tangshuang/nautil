import { useState, useEffect, useMemo } from 'react'
import { getObjectHash } from 'ts-fns'
import { useShallowLatest } from './shallow-latest.js'

/**
 * compute with models and recompute when the models change
 * @param {*} models
 * @param {*} compute
 * @param  {...any} args
 * @returns
 */
export function useModelsReactor(models, compute, ...args) {
  const latest = useShallowLatest(models)
  const latestArgs = useShallowLatest(args)
  const [state, setState] = useState()

  const { vdom, deps, hash } = useMemo(() => {
    const items = models.map((model) => {
      return { model, keys: [] }
    })

    items.forEach((item) => {
      const { model, keys } = item
      const collect = (keyPath) => {
        const [root] = keyPath
        if (!keys.includes(root)) {
          keys.push(root)
        }
      }
      item.collect = collect

      model.on('get', collect)
    })

    const vdom = compute(...args)

    items.forEach((item) => {
      const { model, collect } = item
      model.off('get', collect)
      delete item.collect
    })

    const deps = items.map(item => item.keys)
    const hash = getObjectHash(deps)

    return { vdom, deps, hash }
  }, [state, latest, latestArgs])

  useEffect(() => {
    const forceUpdate = () => setState({})
    models.forEach((model, i) => {
      const keys = deps[i]
      keys.forEach((key) => {
        model.watch(key, forceUpdate, true)
      })
    })

    return () => {
      models.forEach((model, i) => {
        const keys = deps[i]
        keys.forEach((key) => {
          model.unwatch(key, forceUpdate)
        })
      })
    }
  }, [hash, latest])

  return vdom
}