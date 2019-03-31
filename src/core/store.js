import { defineProperty, defineGetter, parse, assign, valueOf, setPrototype, clone, getStringHashcode, isEmpty, isInstanceOf, isObject, isArray, makeKeyChainByPath, makeKeyPathByChain, inObject, isUndefined, isEqual, isString, isArray, each, isFunction, defineProperties, stringify } from '../utils/index.js'

export class Store {
  constructor(sources) {
    this.$define('$__snapshots', [])
    this.$define('$__validators', [])

    this.$define('$hash', '')

    this.$define('$__dep', {})
    this.$define('$__deps', [])
    this.$define('$__refers', [])
    this.$define('$__computers', {}) // 用于收集所有计算器
    this.$define('$__context', null) // 用于绑定计算器的上下文
    this.$define('$__listeners', [])

    this.$define('$parent', null)
    this.$define('$__key', '')

    this.$define('$__silent', false)
    this.$define('$__locked', false)
    this.$define('$__strict', false)
    this.$define('$__inited', false) // 用来记录是否已经塞过数据了
    this.$define('$__isBatchUpdate', false) // 记录是否开启批量更新
    this.$define('$__batch', []) // 用来记录批量一次更新的内容

    this.$define('$__data', {})
    this.$define('$__sources', sources)

    this.$init()
  }

  // 独立出$init主要是为了方便被继承时修改默认动作
  $init() {
    const sources = this.$__sources
    // 写入数据
    if (sources) {
      this.$put(sources)
    }
  }

  /**
   * 设置一个不可枚举属性
   * @param {*} key
   * @param {*} value
   */
  $define(key, value) {
    defineProperty(this, key, value, { configurable: true })
    return this
  }
  /**
   * 设置一个不可枚举的计算属性
   * @param {*} key
   * @param {*} get
   */
  $enhance(key, get) {
    defineGetter(this, key, get, { configurable: true })
    return this
  }

  /**
   * 获取key对应的值
   * @param {*} path
   */
  $get(path) {
    return parse(this, path)
  }
  /**
   * 设置一个普通值属性
   * @param {*} path
   * @param {*} value
   */
  $set(path, value) {
    if (this.$isLocked()) {
      return this
    }

    function xdefine(target, key, value) {
      assign(target.$__data, key, valueOf(value)) // 一定要提前设置
      value = xcreate(value, key, target)

      Object.defineProperty(target, key, {
        configurable : true,
        enumerable : true,
        set: (v) => {
          if (target.$isLocked()) {
            return
          }

          // 校验数据
          if (target.$isStrict()) {
            target.$validate(key, v)
            return
          }

          let oldData = valueOf(target)

          value = xcreate(v, key, target)

          // 直接更新数据
          assign(target.$__data, key, valueOf(v))

          // 触发watch
          // 会冒泡上去
          let newData = clone(target.$__data)
          target.$dispatch(key, newData, oldData)

          // 更新hash
          target.$define('$hash', getStringHashcode(target.toString()))
        },
        get() {
          /**
           * 这里需要详细解释一下
           * 由于依赖收集中$__dep仅在顶层的this中才会被给key和getter，因此，只能收集到顶层属性
           * 但是，由于在进行监听时，deep为true，因此，即使是只有顶层属性被监听，当顶层属性的深级属性变动时，这个监听也会被触发，因此也能带来依赖响应
           */
          if (!isEmpty(target.$__dep)) {
            target.$__dep.dependency = key
            target.$__collect()
          }

          return value
        },
      })
    }

    function xcreate(value, key, target) {
      if (isInstanceOf(value, Store)) {
        // 这里需要注意：当把一个objext实例作为子属性值加入另外一个objext的时候，会被修改$__key和$__parent，这要求该objext实例是独占的，如果被多处使用，会存在引用错误问题，解决的一种办法是使用$clone(true)创建一个完全备份
        let objx = value.$clone()
        objx.$define('$__key', key)
        objx.$define('$parent', target)
        target.$__data[key] = objx.$__data // 数据引用

        return objx
      }
      else if (isObject(value)) {
        let objx = new Store()
        objx.$define('$__key', key)
        objx.$define('$parent', target)
        target.$__data[key] = objx.$__data // 数据引用

        objx.$put(value)
        return objx
      }
      else if (isArray(value)) {
        return xarray(value, key, target)
      }
      else {
        return value
      }
    }

    function xarray(value, key, target) {
      let xarr = []

      let prototypes = Store.prototype
      //  创建一个proto作为一个数组新原型，这个原型的push等方法经过改造
      let proto = []

      // 下面这些属性都是为了冒泡准备的，array没有$set等设置相关的属性
      let descriptors = {
        $__key: {
          value: key,
        },
        $parent: {
          value: target,
        },
        $__data: {
          get: () => target.$__data[key],
        },
        $__listeners: {
          value: [],
        },
        $__validators: {
          value: [],
        },
        $define: {
          value: prototypes.$define.bind(xarr),
        },
        $enhance: {
          value: prototypes.$enhance.bind(xarr),
        },
        $dispatch: {
          value: prototypes.$dispatch.bind(xarr),
        },
        $validate: {
          value: prototypes.$validate.bind(xarr),
        },
        $isLocked: {
          value: prototypes.$isLocked.bind(xarr),
        },
        $isSilent: {
          value: prototypes.$isSilent.bind(xarr),
        },
        $isStrict: {
          value: prototypes.$isStrict.bind(xarr),
        },
        $__inited: {
          value: true,
        },
        valueOf: {
          value: prototypes.valueOf.bind(xarr),
        },
        toString: {
          value: prototypes.toString.bind(xarr),
        },
      }

      let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
      methods.forEach((method) => {
        descriptors[method] = {
          value: function(...args) {
            if (this.$isLocked()) {
              return this
            }

            // 这里注意：数组的这些方法没有校验逻辑，因为你不知道这些方法到底要对那个元素进行修改

            let oldData = target.valueOf()

            // 这里需要处理当...args里面包含了计算属性的问题
            Array.prototype[method].call(target.$__data[key], ...clone(args))
            Array.prototype[method].call(this, ...args)

            // TODO: 根据不同类型的操作判断是否要重新xdefine
            this.forEach((item, i) => {
              // 调整元素的path信息，该元素的子元素path也会被调整
              xdefine(this, i , item)
            })

            let newData = target.valueOf()
            target.$dispatch(key, newData, oldData)
          }
        }
      })

      Object.defineProperties(proto, descriptors)
      // 用proto作为数组的原型
      setPrototype(xarr, proto)

      value.forEach((item, i) => {
        xdefine(xarr, i, item)
      })

      return xarr
    }

    // 数据校验
    // 校验过程如果想要跑出错误，可以在warn里面使用throw new Error
    if (this.$isStrict()) {
      this.$validate(path, value)
      return
    }

    let oldData = this.valueOf()

    let chain = makeKeyChainByPath(path)
    let key = chain.pop()
    let node = this

    for (let i = 0, len = chain.length; i < len; i ++) {
      let touch = chain[i]
      let next = chain[i + 1] || key
      if (/^[0-9]+$/.test(next) && !isArray(node[touch])) {
        xdefine(node, touch, [])
      }
      else if (!isObject(node[touch])) {
        xdefine(node, touch, {})
      }
      node = node[touch]
    }

    xdefine(node, key, value)

    let newData = this.valueOf()

    // 触发watch绑定的回调函数
    // 注意，批量开启时，不会触发，触发逻辑都在dispatch方法中
    this.$dispatch(path, newData, oldData)

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }
  /**
   * 移除一个属性
   * 不能直接用delete obj.prop这样的操作，否则不能同步内部数据，不能触发$dispatch
   * @param {*} path
   */
  $remove(path) {
    if (this.$isLocked()) {
      return this
    }

    if (!this.$has(path)) {
      return this
    }

    let chain = makeKeyChainByPath(path)
    let key = chain.pop()
    let oldData = this.valueOf()

    if (!chain.length) {
      delete this[key]
      delete this.$__data[key]
    }
    else {
      let target = makeKeyPathByChain(chain)
      let data = parse(this.$__data, target)
      let node = parse(this, target)
      delete data[key]
      delete node[key]
    }

    // 把计算属性的计算规则删掉
    this.$__deps.forEach((item, i) => {
      if (item.key === path) {
        this.$unwatch(item.dependency, item.callback)
        this.$__deps.splice(i, 1)
      }
      // 注意，这里没有删除其他对这个path属性有依赖的watchers，因为我们可以用$set添加这个属性，添加可以引起其他依赖这个属性的属性的变化
    })
    // 删除掉计算属性的getter
    delete this.$__computers[path]
    // 把计算属性对外部的引用也删除
    this.$__refers.forEach((item, i) => {
      if (item.key === path) {
        item.target.$unwatch(item.dependency, item.callback)
        refers.splice(i, 1)
      }
    })

    let newData = this.valueOf()
    this.$dispatch(path, newData, oldData)

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }
  /**
   * 判断一个key是否在当前数据中存在
   * @param {*} path
   */
  $has(path) {
    let target = this.$__data
    let chain = makeKeyChainByPath(path)

    for (let i = 0, len = chain.length; i < len; i ++) {
      let key = chain[i]
      if (typeof target !== 'object' || !inObject(key, target)) {
        return false
      }
      target = target[key]
    }

    return true
  }

  /**
   * 全量更新数据，老数据会被删除，原有的计算属性依赖关系会被清除
   * @param {*} data 要设置的数据
   */
  $put(data) {
    if (this.$isLocked()) {
      return this
    }

    // 先把当前视图的所有数据删掉
    let keys = Object.keys(this)
    let currentData = this.$__data
    keys.forEach((key) => {
      delete currentData[key]
      delete this[key]
    })

    // 把计算属性的计算规则删掉
    this.$__deps.forEach((item) => {
      this.$unwatch(item.dependency, item.callback)
    })
    this.$__deps.length = 0
    // 把计算属性对外部的引用也删除
    this.$__refers.forEach((item) => {
      item.target.$unwatch(item.dependency, item.callback)
    })
    this.$__refers.length = 0
    // 清除计算器
    this.$define('$__computers', {})

    // 把数据塞进去
    this.$update(data)

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }
  /**
   * 增量更新数据
   * @param {*} data
   */
  $update(data) {
    if (this.$isLocked()) {
      return this
    }

    let keys = Object.keys(data)
    let computed = []
    let normal = []

    this.$start()

    // 下面这个forEach结束后，可以得到一个完整的$__data，但是它上面保存着初始值，计算属性的值还需要进一步进行计算后得出
    keys.forEach((key) => {
      // 把计算属性的计算规则删掉
      this.$__deps.forEach((item, i) => {
        if (item.key === key) {
          this.$unwatch(item.dependency, item.callback)
          this.$__deps.splice(i, 1)
        }
        // 注意，这里没有删除其他对这个key属性有依赖的watchers，因为我们可以用$set添加这个属性，添加可以引起其他依赖这个属性的属性的变化
      })
      // 把计算器删掉
      delete this.$__computers[key]
      // 把计算属性对外部的引用也删除
      this.$__refers.forEach((item, i) => {
        if (item.key === key) {
          item.target.$unwatch(item.dependency, item.callback)
          refers.splice(i, 1)
        }
      })

      let descriptor = Object.getOwnPropertyDescriptor(data, key)
      // 计算属性
      if (descriptor.get) {
        computed.push({
          key,
          getter: descriptor.get,
        })
      }
      // 普通属性
      else {
        normal.push({
          key,
          value: data[key]
        })
      }

      // 把初始化结果先放在$__data上，这样后面到依赖搜集过程才不会报错
      // 但它不是最终值（缓存），而只是一个初始值，最终值要等待依赖收集执行完毕
      assign(this.$__data, key, valueOf(data[key]))
    })

    // 第一次实例化objext时，$describe只是为当前实例设置了这些计算属性，要等到下面到才会真正创建值（缓存）
    computed.forEach((item) => {
      this.$describe(item.key, item.getter)
    })
    // 之所以要放在后面，是因为在set的时候，也可能依赖到$__data上到值
    normal.forEach((item) => {
      this.$set(item.key, item.value)
    })

    this.$end()

    // $__inited为true的情况下，才能进行依赖收集，否则不允许
    // 首次运行的时候，有些属性可能还没赋值上去，因为里面的this.xxx可能还是undefined，会引起一些错误，因此，必须将$__inited设置为false，阻止计算属性初始化操作
    this.$define('$__inited', true)

    // 计算计算属性的最终值（缓存），并且在过程中实现依赖收集
    computed.forEach((item) => {
      this.$__compute(item.key)
    })

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }

  /**
   * 是否禁止触发watch回调，以安静模式更新数据
   * @param {*} status 为true表示启用安静模式，执行完一些操作之后，要使用false关闭安静模式，否则永远都无法触发watch回调
   */
  $silent(status) {
    this.$define('$__silent', !!status)
    return this
  }
  $isSilent() {
    if (this.$__silent) {
      return true
    }

    let parent = this.$parent
    while (parent) {
      if (parent.$__silent) {
        return true
      }
      parent = parent.$parent
    }

    return false
  }
  /**
   * 开启批量更新模式
   * 批量更新模式开启后，仅在执行end方法时才会触发watch回调，这样可以避免在一次批量操作中对同一个path进行了多次watch回调触发
   */
  $start() {
    this.$define('$__isBatchUpdate', true)
    return this
  }
  /**
   * 结束批量更新模式
   */
  $end() {
    const batches = [].concat(this.$__batch)

    // 重置信息，需要先重置，否则this.$dispatch不工作
    this.$define('$__isBatchUpdate', false)
    this.$__batch.length = 0

    // 不再触发dispatch操作
    if (!this.$isSilent()) {
      // 把收集到的变动集中起来，去重，得到最小集
      const batch = {}
      batches.forEach(({ path, newData, oldData }) => {
        batch[path] = {
          path,
          newData,
        }
        // 对于老数据，只用最开始那个，后面的oldData其实都不是真正的oldData
        if (isUndefined(batch[path].oldData)) {
          batch[path].oldData = oldData
        }
      })
      const list = Object.values(batch)
      list.forEach(({ path, newData, oldData }) => this.$dispatch(path, newData, oldData))
    }

    return this
  }

  /**
   * 设置一个计算属性
   * @param {*} key
   * @param {*} getter
   */
  $describe(key, getter) {
    // 直接从$__data上读取缓存
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable : true,
      get: () => {
        let value = parse(this.$__data, key)
        return value
      },
    })
    // 记录计算器
    this.$__computers[key] = getter

    // 计算该属性的值，并patch到$__data上，并且，这个过程中实现了依赖收集
    this.$__compute(key)

    return this
  }
  /**
   * 属性计算
   */
  $__compute(key) {
    // 仅在已经初始化好的objext上执行计算
    if (!this.$__inited) {
      return this
    }

    // 获取计算器
    let getter = this.$__computers[key]
    if (!getter) {
      return this
    }

    // getter执行过程中会有依赖收集
    this.$define('$__dep', { key })
    let newValue = getter.call(this.$__context || this)
    assign(this.$__data, key, valueOf(newValue))
    this.$define('$__dep', {})

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }
  /**
   * 依赖收集
   */
  $__collect() {
    // 仅在已经初始化好的objext上执行计算
    if (!this.$__inited) {
      return this
    }

    let { key, dependency } = this.$__dep
    if (!key || !dependency) {
      return this
    }

    // 已经收集过了，就不再进行收集
    if (this.$__deps.some(item => item.key === key && item.dependency === dependency)) {
      return this
    }

    // 多重依赖收集
    let callback = () => {
      let oldData = this.valueOf()
      this.$__compute(key)
      let newData = this.valueOf()
      this.$dispatch(key, newData, oldData)
    }
    this.$__deps.push({ key, dependency, callback })
    this.$watch(dependency, callback, true)

    return this
  }

  /**
   * 绑定两个objext实例，当目标实例的被依赖属性值发生变化时，重新计算当前实例的值。
   * 仅用于计算属性。
   * @param {string} key 自己的计算属性
   * @param {object} target 目标实例
   * @param {string} dependency 目标实例被依赖的属性路径
   * @example
   * const objx2 = new Store({
   *   body: {
   *     head: 12
   *   }
   * })
   * const objx = new Store({
   *   get weight({ objx2 }) {
   *    return objx2.body.head * 17.8
   *   },
   * })
   * objx.$depend('weight', objx2)
   * // 这样，当objx2.body.head发生变化的时候，objx的weight属性会重新计算，并将结果缓存起来
   */
  $depend(key, target, dependency) {
    // 非计算属性不支持
    if (!this.$__computers[key]) {
      return this
    }

    const getter = this.$__computers[key]
    const refers = this.$__refers
    const callback = ({ newValue, oldValue }) => {
      if (!isEqual(newValue, oldValue)) {
        let oldData = this.valueOf()
        this.$__compute(key)
        let newData = this.valueOf()
        this.$dispatch(key, newData, oldData)
      }
    }

    // 加入到refers中记录下来后面可以取消
    let index = refers.findIndex(item => item.key == key && item.target === target)
    // 如果已经存在这个name了，那么要先解绑
    if (index > -1) {
      this.$undepend(key, target)
    }

    // 如果传了dependency，则更快处理
    if (dependency) {
      refers.push({
        key,
        target,
        dependency,
        callback,
      })
      target.$watch(dependency, callback, true)
      this.$__compute(key)
      return this
    }

    // 重写target的依赖收集器
    target.$__collect = () => {
      // 仅在已经初始化好的objext上执行计算
      if (!target.$__inited) {
        return target
      }

      let { key, dependency, callback, refers } = target.$__dep
      if (!key || !dependency || !callback || !refers) {
        return target
      }

      // 已经收集过了，就不再进行收集
      if (refers.some(item => item.key === key && item.target === target && item.dependency === dependency)) {
        return target
      }

      // 多重依赖收集
      refers.push({
        key,
        target,
        dependency,
        callback,
      })
      target.$watch(dependency, callback, true)

      return target
    }

    // getter执行过程中会有依赖收集
    let oldData = this.valueOf()
    // 加入依赖列表
    target.$define('$__dep', { key, callback, refers })
    let newValue = getter.call(this.$__context || this)
    assign(this.$__data, key, valueOf(newValue))
    target.$define('$__dep', {})
    let newData = this.valueOf()
    this.$dispatch(key, newData, oldData)

    // 删除方法重写，恢复默认动作
    delete target.$__collect

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }
  /**
   * 解除绑定
   * @param {*} key
   * @param {*} target
   * @param {string} dependency 指定要解绑的目标属性
   */
  $undepend(key, target, dependency) {
    // 非计算属性不支持
    if (!this.$__computers[key]) {
      return this
    }

    const refers = this.$__refers
    // 将原有的依赖清除先
    refers.forEach((item, i) => {
      if (item.key === key && (target === undefined || item.target === target) && (target !== undefined && (dependency === undefined || dependency === item.dependency))) {
        item.target.$unwatch(item.dependency, item.callback)
        refers.splice(i, 1)
      }
    })

    // 重新计算一次
    let oldData = this.valueOf()
    this.$__compute(key)
    let newData = this.valueOf()
    this.$dispatch(key, newData, oldData)

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }

  /**
   * 将当前实例的计算属性中的this重新指向另外一个objext实例
   * 一般会在当前实例作为另外一个实例的子属性时使用，
   * @param {*} context
   */
  $bind(context) {
    if (isInstanceOf(context, Store) && context !== this) {
      this.$define('$__context', context)

      let keys = Object.keys(this.$__computers)
      keys.forEach((key) => {
        this.$depend(key, context)
      })
    }
    // 如果context为非objext实例，则删除绑定关系
    else {
      this.$define('$__context', null)

      let keys = Object.keys(this.$__computers)
      keys.forEach((key) => {
        this.$undepend(key, context)
      })
    }
    return this
  }

  /**
   * 添加一个watch回调
   * @param {string|array} path
   * @param {*} fn
   * @param {*} deep
   */
  $watch(path, fn, deep) {
    // 数组，则一次性添加多个
    if (isArray(path)) {
      path.forEach((path) => this.$watch(path, fn, deep))
      return this
    }

    // 不是字符串则不允许设置
    if (!isString(path) && !path) {
      return this
    }

    path = makeKeyPathByChain(makeKeyChainByPath(path))

    this.$__listeners.push({
      path,
      fn,
      deep,
    })

    return this
  }
  /**
   * 去除一个watch回调
   * @param {*} path
   * @param {*} fn
   */
  $unwatch(path, fn) {
    let indexes = []
    this.$__listeners.forEach((item, i) => {
      if (item.path === path && item.fn === fn) {
        indexes.push(i)
      }
    })
    // 从后往前删，不会出现问题
    indexes.reverse()
    indexes.forEach(i => this.$__listeners.splice(i, 1))
    return this
  }
  /**
   * 触发watchers，注意，newData和oldData不是path对应的值，而是整个objx的值，通过path从它们中获取对应的值，在watcher的回调函数中，得到的是wathcher自己的path对应的值
   * @param {*} path
   * @param {*} newData this的新数据
   * @param {*} oldData this的老数据
   */
  $dispatch(path, newData, oldData) {
    if (!this.$__inited) {
      return this
    }

    if (this.$isLocked()) {
      return this
    }

    // 收集批量修改过程中的的变动
    if (this.$__isBatchUpdate) {
      this.$__batch.push({ path, newData, oldData })
      return this
    }

    if (this.$isSilent()) {
      return this
    }

    let match = path.toString()
    let listeners = this.$__listeners.filter(item => item.path === path || (item.deep && (match.indexOf(item.path + '.') === 0 || match.indexOf(item.path + '[') === 0)))
    let propagation = true
    let pipeline = true
    let stopPropagation = () => propagation = false
    let preventDefault = () => pipeline = false
    let createE = (item, newValue, oldValue) => {
      let e = {}
      let error = new Error('')
      let stackraw = error.stack || ''

      let stacks = stackraw.split('\n')
      stacks.shift()
      stacks.shift()
      stacks = stacks.map(line => line.trim())

      let stack = stacks.join('\n')

      defineProperties(e, {
        match: item.path,
        deep: !!item.deep,
        path,
        target: this,
        newValue,
        oldValue,
        stopPropagation,
        preventDefault,
        stack,
      }, false)

      return e
    }

    for (let i = 0, len = listeners.length; i < len; i ++) {
      let item = listeners[i]
      let targetPath = item.path
      let newValue = parse(newData, targetPath)
      let oldValue = parse(oldData, targetPath)
      let e = createE(item, newValue, oldValue)

      item.fn(e, newValue, oldValue)

      // 阻止继续执行其他listener
      if (!pipeline) {
        break
      }
    }

    // *的监听在所有监听器后面，最后执行这些监听器
    if (pipeline) {
      let always = this.$__listeners.filter(item => item.path === '*')
      for (let i = 0, len = always.length; i < len; i ++) {
        let item = always[i]
        let e = createE(item, newData, oldData)

        item.fn(e, newData, oldData)

        // 阻止继续执行其他*的listener
        if (!pipeline) {
          break
        }
      }
    }

    // 向上冒泡
    if (propagation) {
      let parent = this.$parent
      let key = this.$__key
      if (parent && parent.$dispatch) {
        let parentNewData = parent.$__data
        let parentOldData = assign(clone(parentNewData), key, oldData)
        let fullPath = key + '.' + path
        let finalPath = makeKeyPathByChain(makeKeyChainByPath(fullPath))

        // 上一级objext又会触发再上一级的$dispatch
        parent.$dispatch(finalPath, parentNewData, parentOldData)
      }
    }

    return this
  }

  /**
   * 创建一个快照，使用reset可以恢复这个快照
   */
  $commit(tag) {
    if (this.$isLocked()) {
      return this
    }

    if (tag === undefined) {
      return this
    }

    let data = this.valueOf()
    let snapshots = this.$__snapshots
    let i = snapshots.findIndex(item => item.tag === tag)

    let listeners = [].concat(this.$__listeners)
    let deps = [].concat(this.$__deps)
    let computers = Object.assign({}, this.$__computers)
    let context = this.$__context
    let refers = [].concat(this.$__refers)

    let item = {
      tag,
      data,
      listeners,
      deps,
      computers,
      refers,
      context,
    }

    // 把已经存在的移除掉
    if (i > -1) {
      snapshots.splice(i, 1)
    }

    snapshots.push(item)

    this.$define('$__data', {})
    this.$put(clone(data))

    this.$define('$__listeners', [].concat(listeners))
    this.$define('$__deps', [].concat(deps))
    this.$define('$__computers', Object.assign({}, computers))
    this.$define('$__context', context)
    this.$define('$__refers', [].concat(refers))

    // 还原计算属性
    each(computers, (value, key) => {
      this.$describe(key, value)
    })

    return this
  }
  /**
   * 将数据恢复到快照的内容
   */
  $reset(tag) {
    if (this.$isLocked()) {
      return this
    }

    let snapshots = this.$__snapshots
    let item = null

    // 不传的时候，恢复到上一个快照
    if (tag === undefined) {
      item = snapshots[snapshots.length - 1]
    }
    else {
      item = snapshots.find(item => item.tag === tag)
    }

    if (!item) {
      return this
    }

    let { data, listeners, deps, computers, refers, context } = item

    this.$define('$__data', {})
    this.$put(clone(data))
    this.$define('$__listeners', [].concat(listeners))
    this.$define('$__deps', [].concat(deps))
    this.$define('$__computers', Object.assign({}, computers))
    this.$define('$__context', context)
    this.$define('$__refers', [].concat(refers))

    // 还原计算属性
    each(computers, (value, key) => {
      this.$describe(key, value)
    })

    // 更新hash
    this.$define('$hash', getStringHashcode(this.toString()))

    return this
  }
  /**
   * 将对应tag的快照从缓存中移除。
   * 注意，如果缓存中有多个相同tag的快照，它们会被同时移除。
   * @param {*} tag
   */
  $revert(tag) {
    if (this.$isLocked()) {
      return this
    }

    let snapshots = this.$__snapshots

    // 不传tag，删除上一个快照
    if (tag === undefined) {
      snapshots.length -= 1
    }
    else {
      snapshots.forEach((item, i) => {
        if (item.tag === tag) {
          snapshots.splice(i, 1)
        }
      })
    }

    return this
  }

  /**
   * 锁定数据，无法做任何操作
   */
  $lock() {
    this.$define('$__locked', true)
    return this
  }
  /**
   * 解锁
   */
  $unlock() {
    this.$define('$__locked', false)
    return this
  }
  $isLocked() {
    if (this.$__locked) {
      return true
    }

    let parent = this.$parent
    while (parent) {
      if (parent.$__locked) {
        return true
      }
      parent = parent.$parent
    }

    return false
  }

  /**
   * 设置校验器
   * @param {*} validators 格式如下：
   * [
   *    {
   *        path: 'body.head', // 要监听的路径
   *        determine: value => typeof value === 'object', // 在什么情况下才执行校验器
   *        validate: value => typeof value === 'object', // 要执行的检查器
   *        message: '头必须是一个对象',
   *        warn: (error) => {},
   *        deferred: true, // 是否异步校验，异步校验不会中断校验过程，从当前进程中脱离出去，而是交给异步进程去处理，如果全部校验器都是异步的,$validate会返回一个promise
   *        order: 10, // 校验的顺序，从小到大排序
   *    }
   * ]
   */
  $formulate(validators) {
    validators = isArray(validators) ? validators : [validators]
    validators.forEach(item => this.$__validators.push(item))
    return this
  }
  /**
   * 校验数据
   * @param {*} keyPath 可选，不传时校验所有规则
   * @param {*} next 可选，用该值作为备选值校验，在$set新值之前对该新值做校验时使用
   * @return {Error} 一个Error的实例，message是校验器中设置的，同时，它附带两个属性（value, path），并且它会被传给校验器中的warn函数
   */
  $validate(keyPath, next) {
    const argsLen = arguments.length
    const isEmptyKeyPath = argsLen === 0 || isEmpty(keyPath)
    const foundvalidators = this.$__validators.filter(item => item && (isEmptyKeyPath || item.path === keyPath)) // keyPath不传的时候，校验全部验证规则
    const validators = sortBy(foundvalidators, 'order')

    const createError = ({ path, value, message, warn }) => {
      let msg = isFunction(message) ? message.call(this.$__context || this, { path, value }) : message // message支持函数
      let error = new Error(msg)
      defineProperties(error, {
        value,
        path,
        target: this,
      })
      if (isFunction(warn)) {
        warn.call(this.$__context || this, error)
      }
      return error
    }

    let result = null

    for (let i = 0, len = validators.length; i < len; i ++) {
      let item = validators[i]
      if (!isObject(item)) {
        continue
      }

      let { validate, message, warn, path, determine, deferred } = item // 这里path是必须的，当参数path为undefined的时候，要通过这里来获取
      let key = path === '*' || isEmpty(path) ? '' : path
      let value = argsLen >= 2 && !isEmptyKeyPath ? next : parse(this.valueOf(), key)

      // 某些情况下不检查该字段
      if (isFunction(determine) && !determine.call(this.$__context || this, value)) {
        continue
      }

      // 异步校验部分
      if (deferred) {
        Promise.resolve().then(() => validate.call(this.$__context || this, value)).then((bool) => {
          if (!bool) {
            return createError({ path, value, message, warn })
          }
        })
        continue
      }

      let bool = validate.call(this.$__context || this, value)
      if (!bool) {
        result = createError({ path, value, message, warn })
        break
      }
    }

    // 向下传递，检查当前被检查的属性的子属性的校验规则
    const validateChild = (keyPath) => {
      let key = keyPath === '*' ? '' : keyPath
      let child = parse(this, key)
      if (isInstanceOf(child, Store)) {
        let res = child.$validate() // 向下传递的时候，就全量校验
        if (isInstanceOf(res, Error)) {
          return res
        }
      }
      else if (isArray(child)) {
        for (let i = 0, len = child.length; i < len; i ++) {
          let item = child[i]
          if (isInstanceOf(item, Store)) {
            let res = item.$validate() // 向下传递的时候，就全量校验
            if (isInstanceOf(res, Error)) {
              return res
            }
          }
        }
      }
    }
    if (argsLen === 0) {
      let keys = Object.keys(this.$__data)
      for (let i = 0, len = keys.length; i < len; i ++) {
        let key = keys[i]
        let res = validateChild(key)
        if (isInstanceOf(res, Error)) {
          return res
        }
      }
    }
    else if (argsLen === 1 && !isEmptyKeyPath) {
      let res = validateChild(keyPath)
      if (isInstanceOf(res, Error)) {
        return res
      }
    }

    return result
  }
  $strict(status) {
    this.$define('$__strict', !!status)
    return this
  }
  $isStrict() {
    if (this.$__strict) {
      return true
    }

    let parent = this.$parent
    while (parent) {
      if (parent.$__strict) {
        return true
      }
      parent = parent.$__strict
    }

    return false
  }

  /**
   * 基于当前对象，克隆出一个新对象
   */
  $clone(complete = false) {
    const Constructor = this.constructor // 解决当有些类继承Objext时的问题

    let value = this.valueOf()
    let objx = new Constructor(this.$__sources)

    let deps = this.$__deps
    let listeners = this.$__listeners
    let computers = this.$__computers
    let context = this.$__context
    let refers = this.$__refers

    objx.$put(value)

    // 还原事件监听，需要在还原计算属性之前执行
    if (complete) {
      objx.$define('$__deps', [].concat(deps))
      objx.$define('$__listeners', [].concat(listeners))
      objx.$define('$__computers', Object.assign({}, computers))
      this.$define('$__context', context)
      objx.$define('$__refres', [].concat(refers))
    }

    // 还原计算属性
    each(computers, (value, key) => {
      objx.$describe(key, value)
    })

    // 更新hash
    objx.$define('$hash', getStringHashcode(objx.toString()))

    return objx
  }
  $destory() {
    this.$__refers.forEach((item) => {
      item.target.$unwatch(item.dependency, item.callback)
    })

    this.$define('$__snapshots', null)
    this.$define('$__validators', null)
    this.$define('$__listeners', null)

    this.$define('$__data', null)

    this.$define('$hash', null)

    this.$define('$__dep', null)
    this.$define('$__deps', null)
    this.$define('$__refers', null)
    this.$define('$__computers', null)
    this.$define('$__contexts', null)

    this.$define('$parent', null)
    this.$define('$__key', '')

    this.$define('$__silent', null)
    this.$define('$__locked', null)
    this.$define('$__inited', null)
    this.$define('$__isBatchUpdate', null)
    this.$define('$__batch', null)

    this.$define('$__sources', null)
    this.$put({})
  }
  /**
   * 获取数据，和valueOf不一样，它获取数据直接从$__data上取，效率更高
   */
  $data() {
    return valueOf(this.$__data)
  }
  valueOf() {
    return valueOf(this)
  }
  toString() {
    return stringify(this.valueOf())
  }
}
