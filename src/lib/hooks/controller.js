import { useForceUpdate } from './force-update.js'
import { useMemo, useEffect } from 'react'

export function useController(Controller) {
  const forceUpdate = useForceUpdate()
  const controller = useMemo(() => new Controller(), [Controller])
  useEffect(() => {
    controller.subscribe(forceUpdate)
    return () => {
      controller.unsubscribe(forceUpdate)
      controller.destroy()
    }
  }, [controller])
  return controller()
}
