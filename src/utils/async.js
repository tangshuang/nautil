/**
 * 将一个函数转化为async函数
 * @param {*} fn
 */
export function toAsyncFunction(fn) {
  return function(...args) {
    try {
      return Promise.resolve(fn.apply(this, args))
    }
    catch(e) {
      return Promise.reject(e);
    }
  }
}
