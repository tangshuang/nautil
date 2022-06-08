import { useEffect, useRef, useState } from 'react'
import { query, setup } from 'algeb'
import { isDataSource } from '../services/data-service'
import { useForceUpdate } from './force-update'
import { useShallowLatest } from './shallow-latest'

/**
 * 获取数据源中的数据，一开始就触发数据请求
 * @param source 数据源对象
 * @param params 要进行数据请求的参数
 * @returns [data, renew]
 * - data: 当前source的值
 * - renew: 用于更新数据的函数
 * @notice 如果传入的source根本不是data source，那么会返回空的内容，这个use无效，不产生任何作用，在代码中，你需要自己手动进行判断，例如：
 * const [data] = useDataSource(source as Source<RadioOption[], void>); // useDataSource不会报错，这样不会破坏react使用hooks的原则
 * const options = isDataSource(source) ? data : source; // 根据判断结果选择是否使用useDataSource的结果
 */
export function useDataSource(source, ...params) {
  const ref = useRef([source?.value, () => Promise.resolve(source?.value)])
  const args = useShallowLatest(params)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isDataSource(source)) {
      return
    }
    let timer
    const stop = setup(() => {
      const [data, renew, deferer] = query(source, ...args)
      ref.current = [data, renew]
      setLoading(true)
      clearTimeout(timer)
      timer = setTimeout(() => {
        deferer.finally(() => setLoading(false))
      }, 0)
    })
    return stop
  }, [source, args])

  return [...ref.current, loading]
}

/**
 * 异步触发数据请求，一开始不进行数据请求，直到你调用fetch时
 * @param source 数据源对象
 * @param params 要进行数据请求的参数
 * @returns [data, fetch]
 * - data: 当前source的值
 * - fetch: 用于拉取数据的函数
 * - init: 用于第一次拉取数据，仅能拉取一次，再次触发时不会拉取数据
 */
export function useLazyDataSource(source, ...params) {
  const value = useRef(source?.value)
  const inited = useRef(false)
  const refetch = useRef(() => Promise.resolve(source?.value))

  const forceUpdate = useForceUpdate()
  const args = useShallowLatest(params)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isDataSource(source)) {
      return
    }
    if (!inited.current) {
      return
    }

    let timer
    const stop = setup(() => {
      const [data, renew, deferer] = query(source, ...args)
      value.current = data
      refetch.current = renew
      setLoading(true)
      clearTimeout(timer)
      timer = setTimeout(() => {
        deferer.finally(() => setLoading(false))
      }, 0)
    })
    return stop
  }, [source, args, inited.current])

  const fetch = (...args) => {
    if (inited.current && refetch.current) {
      return refetch.current(...args)
    }

    inited.current = true
    forceUpdate()
    return Promise.resolve(source?.value)
  }

  return [value.current, fetch, loading]
}
