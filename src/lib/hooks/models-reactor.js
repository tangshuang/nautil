import { useState, useEffect, useMemo } from 'react'
import { getObjectHash } from 'ts-fns'
import { useShallowLatest } from './shallow-latest.js'

/**
 * compute with models and recompute when the models change
 * @param {*} models
 * @param {*} compute
 * @param  {...any} args args passed into compute
 * @returns
 */
export function useModelsReactor(models, compute, ...args) {
  const latest = useShallowLatest(models)
  const latestArgs = useShallowLatest(args)
  const [state, setState] = useState()

  const { res, deps, hash } = useMemo(() => {
    models.forEach((model) => {
      model.collect()
    })

    const res = compute(...args)

    const deps = models.map((model) => model.collect(true))
    const hash = getObjectHash(deps)

    return { res, deps, hash }
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

  return res
}
