import { useEffect, useRef, useMemo } from 'react'
import { query, setup } from 'algeb'
import { useForceUpdate } from './force-update.js'
import { useShallowLatest } from './shallow-latest.js'

export function useDataSource(source, ...params) {
  const ref = useRef([source.value, () => Promise.resolve(source.value)])
  const forceUpdate = useForceUpdate()
  const args = useShallowLatest(params)

  useEffect(() => {
    const { stop } = setup(() => {
      ref.current = query(source, ...args)
      forceUpdate()
    })
    return stop
  }, [source, args])

  return ref.current
}

/**
 * 异步触发数据请求，一开始不进行数据请求，直到你调用fetch时
 * @param source 数据源对象
 * @param params 要进行数据请求的参数
 * @returns [data, fetch]
 * - data: 当前source的值
 * - fetch: 用于拉取数据的函数
 */
export function useLazyDataSource(source, ...params) {
  const forceUpdate = useForceUpdate()
  const args = useShallowLatest(params)
  const ref = useRef(source.value)
  const output = useMemo(() => {
    const fetch = (...sources) => {
      return new Promise((resolve, reject) => {
        const stop = setup(() => {
          const [data, request] = query(source, ...params)
          ref.current = data
          request(...sources).then((data) => {
            resolve(data)
            forceUpdate()
          }).catch(reject)
        })
        // 立即销毁不需要使用了
        stop()
      })
    }
    return [ref.current, fetch]
  }, [source, args])
  return output
}
