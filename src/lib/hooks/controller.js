import { useForceUpdate } from './force-update.js'
import { useMemo, useEffect } from 'react'

export function useController(Controller) {
  const forceUpdate = useForceUpdate()
  const controller = useMemo(() => {
    return new Controller()
  }, [Controller])
  useEffect(() => {
    controller.subscribe(forceUpdate)
    return () => {
      controller.unsubscribe(forceUpdate)
      controller.destructor()
    }
  }, [controller])
  return controller
}

export function applyController(Controller) {
  let controller = null
  let count = 0

  const useController = () => {
    const forceUpdate = useForceUpdate()
    useMemo(() => {
      if (!controller) {
        controller = new Controller()
      }
    }, [])
    useEffect(() => {
      count ++
      controller.subscribe(forceUpdate)
      return () => {
        count --
        controller.unsubscribe(forceUpdate)
        setTimeout(() => {
          if (!count) {
            controller.destructor()
            controller = null
          }
        }, 64)
      }
    }, [])
    return controller
  }

  return { useController }
}
