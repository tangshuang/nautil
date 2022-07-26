import { useForceUpdate } from './force-update.js'
import { useMemo, useEffect } from 'react'
import { View } from '../core/view'
import { isInheritedOf } from 'ts-fns'

export function useController(Controller, Persistent) {
  const forceUpdate = useForceUpdate()
  const controller = useMemo(() => {
    if (Persistent && typeof Persistent === 'function' && isInheritedOf(Persistent, View) && Object.values(Persistent).some(item => item === Controller)) {
      return Controller.instance()
    }
    return new Controller()
  }, [Controller, Persistent])
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
