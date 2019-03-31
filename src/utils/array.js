import { inArray } from './is.js'

/**
 * 求数组的并集
 * @param {*} a
 * @param {*} b
 * @example
 * unionArray([1, 2], [1, 3]) => [1, 2, 3]
 */
export function unionArray(a, b) {
  return a.concat(b.filter(v => !inArray(v, a)))
}

/**
 * 求数组交集
 * @param {*} a
 * @param {*} b
 */
export function interArray(a, b) {
  return a.filter(v => b.includes(v))
}

/**
 * 求数组差集，找出a中不在b中的元素集合
 * @param {*} a
 * @param {*} b
 */
export function diffArray(a, b) {
  return a.filter(v => !b.includes(v))
}

/**
 * 求两个数组的补集，即找出并集中非交集的部分
 * @param {*} a
 * @param {*} b
 */
export function complArray(a, b) {
  const union = unionArray(a, b)
  return union.filter(v => !a.includes(v) && !b.includes(v))
}

/**
 * 使数组唯一化
 * @param {*} items
 */
export function uniqueArray(items) {
  return items.filter((item, i) => items.indexOf(item) === i)
}

/**
 * 创建一个特定个数且所有值相同的数组
 * @param {*} value
 * @param {*} count
 */
export function createArray(value, count = 1) {
  return [].fill.call(new Array(count), value)
}

/**
 * 根据字段值大小排序
 * @param {*} items
 * @param {*} keyPath
 * @param {asc|desc} direct 排序方向，升序还是降序
 */
export function sortArray(items, keyPath, direct = 'asc') {
  let res = [].concat(items)
  res.sort((a, b) => {
    let oa = parse(a, keyPath)
    let ob = parse(b, keyPath)

    oa = typeof oa === 'number' && !isNaN(oa) ? oa : 10
    ob = typeof ob === 'number' && !isNaN(ob) ? ob : 10

    if (oa < ob) {
      return direct === 'asc' ? -1 : 1
    }
    if (oa > ob) {
      return direct === 'asc' ? 1 : -1
    }
    return 0
  })
  return res
}
