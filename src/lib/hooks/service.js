import { useEffect } from 'react'
import { isInstanceOf } from 'ts-fns'
import { Service } from '../core/service.js'

/**
 * 使用一个controller
 * @example
 * const ctrl = useController(() => MyController.instance()) // 全局单例
 * const ctrl = useController(() => new MyController()) // 局部实例
 */
export function useService(serv) {
  const service = serv.instance()

  if (!isInstanceOf(service, Service)) {
    throw new Error(`useService 必须返回一个 Service 实例`)
  }

  useEffect(
    () => () => {
      service.destroy()
    },
    [],
  )

  return service
}
