import { useEffect, useMemo } from 'react'
import { useForceUpdate } from './force-update.js'

export function useModel(Model) {
  const forceUpdate = useForceUpdate()
  const model = useMemo(() => new Model(), [Model])
  useEffect(() => {
    model.watch('*', forceUpdate, true)
    model.watch('!', forceUpdate)
    model.on('recover', forceUpdate)
    return () => {
      model.unwatch('*', forceUpdate)
      model.unwatch('!', forceUpdate)
      model.off('recover', forceUpdate)
    }
  }, [model])
  return model
}
