/**
 * 将一个路径字符串转化为数组
 * @example
 * makeKeyPath(makeKeyChain('name.0..body[0].head')) => name[0].body[0].head
 */
export function makeKeyChainByPath(path) {
  let chain = path.toString().split(/\.|\[|\]/).filter(item => !!item)
  return chain
}

/**
 * 将一个路径数组转化为字符串
 * @param {*} chain
 */
export function makeKeyPathByChain(chain) {
  let path = ''
  for (let i = 0, len = chain.length; i < len; i ++) {
    let key = chain[i]
    if (/^[0-9]+$/.test(key)) {
      path += '[' + key + ']'
    }
    else {
      path += path ? '.' + key : key
    }
  }
  return path
}

/**
 * 将不规则的路径字符串转化为标准的路径字符串
 * @param {*} path
 */
export function makeKeyPath(path) {
  let chain = makeKeyChainByPath(path)
  let keyPath = makeKeyPathByChain(chain)
  return keyPath
}
