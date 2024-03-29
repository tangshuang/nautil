import * as scheduler from 'scheduler'
import Reconciler from 'react-reconciler'
import {
  isShallowEqual, isObject, isArray,
  filter, isFunction, assign, clone, isString, createRandomString,
  isUndefined,
} from 'ts-fns'
import produce from 'immer'
import { createElement } from 'react'

const {
  unstable_scheduleCallback: scheduleDeferredCallback,
  unstable_cancelCallback: cancelDeferredCallback,
  unstable_shouldYield: shouldYield,
  unstable_now: now,
} = scheduler

const context = {}

const container = {
  root: null,
  data: null,
  getPath(instance) {
    const find = (parent, path = []) => {
      if (isArray(parent.children)) {
        const i = parent.children.indexOf(instance)
        if (i > -1) {
          return [...path, 'children', i]
        }
        for (const child of parent.children) {
          if (isObject(child)) {
            const subpath = find(child)
            if (subpath.length) {
              return [...path, 'children', ...subpath]
            }
          }
        }
      }
      return path
    }
    return find(container.root)
  },
  update(instance, info) {
    const path = container.getPath(instance)
    if (path.length) {
      container.data = produce(container.data, data => {
        const next = {
          ...instance,
          ...info,
        }
        assign(data, path, next)
      })
    }
  },
  find(selector) {
    if (!selector) {
      return container.root
    }

    const findById = (instance, id) => {
      if (!isObject(instance)) {
        return
      }
      if (instance.id === id) {
        return instance
      }
      if (!instance.children) {
        return
      }
      for (const child of instance.children) {
        const res = findById(child, id)
        if (res) {
          return res
        }
      }
    }

    const findByKey = (instance, key) => {
      if (!isObject(instance)) {
        return
      }
      if (instance.key === key) {
        return instance
      }
      if (!instance.children) {
        return
      }
      for (const child of instance.children) {
        const res = findByKey(child, key)
        if (res) {
          return res
        }
      }
    }

    const findBy = (instance, selector) => {
      const [, tag, , key, value] = selector.match(/(.+?)(\[(.+?)=(.+?)\])?/)

      const find = (instance) => {
        if (!isObject(instance)) {
          return
        }

        if (instance.type === tag && instance.props[key] === value) {
          return instance
        }

        if (!instance.children) {
          return
        }

        for (const child of instance.children) {
          const res = find(child)
          if (res) {
            return res
          }
        }
      }

      const res = find(instance)
      return res
    }

    if (selector.indexOf('#') === 0) {
      const id = selector.substring(1)
      return findById(container.root, id)
    }

    if (selector.indexOf(':') === 0) {
      const key = selector.substring(1)
      return findByKey(container.root, key)
    }

    return findBy(container.root, selector)
  },
}

const createTextNode = (content) => {
  const text = {
    id: createRandomString(16),
    type: '#text',
    content,
  }
  return text
}

let notify = null

const HostConfig = {
  now,
  schedulePassiveEffects: scheduleDeferredCallback,
  cancelPassiveEffects: cancelDeferredCallback,
  shouldYield,
  scheduleDeferredCallback,
  cancelDeferredCallback,
  supportsMutation: true,

  getPublicInstance(instance) {
    return instance
  },
  getRootHostContext(_container) {
    return context
  },
  getChildHostContext(_parentHostContext, _type, _container) {
    return context
  },

  createInstance(type, props, container, context, fiber) {
    const { key } = fiber
    const { children, ...attrs } = props
    const instance = {
      id: createRandomString(16),
      type,
      props: attrs,
    }

    if (key) {
      instance.key = key
    }

    // put text inside
    if (isArray(children)) {
      if (!children.some(item => typeof item === 'object')) {
        instance.children = children.map(str => createTextNode(str))
      }
    }
    else if (typeof children !== 'object') {
      instance.children = [createTextNode(children)]
    }

    return instance
  },
  createTextInstance(_text, _container, _context, _fiber) {
    // text is added in createInstance
  },

  appendInitialChild(parent, child) {
    HostConfig.appendChild(parent, child)
  },
  insertInContainerBefore(parent, child, before) {
    HostConfig.insertBefore(parent, child, before)
  },
  appendChild(parent, child) {
    if (isUndefined(child)) {
      return
    }
    parent.children = parent.children || []
    parent.children.push(child)
  },
  removeChild(parent, child) {
    const { children } = parent
    const i = children.indexOf(child)
    if (i > -1) {
      children.splice(i, 1)
    }
  },
  insertBefore(parent, child, before) {
    const { children } = parent

    const o = children.indexOf(child)
    if (o > -1) {
      children.splice(o, 1)
    }

    const i = children.indexOf(before)
    if (i > -1) {
      children.splice(i, 0, child)
    }
    else {
      children.push(child)
    }
  },

  appendChildToContainer(container, child) {
    container.root = child
    container.data = clone(child)
  },
  removeChildFromContainer(container) {
    container.root = null
    container.data = null
  },
  clearContainer(_container) {},
  finalizeInitialChildren() {
    // return true
  },
  commitMount(_instance) {
  },

  prepareUpdate(instance, type, oldProps, newProps, container, _context) {
    const { children: oldChildren, ...oldAttrs } = oldProps
    const { children: newChildren, ...newAttrs } = newProps

    if (!isShallowEqual(newChildren, oldChildren)) {
      return container
    }

    const olds = filter(oldAttrs, (value) => !isFunction(value))
    const news = filter(newAttrs, (value) => !isFunction(value))
    if (!isShallowEqual(olds, news)) {
      return container
    }
  },
  commitTextUpdate(instance, oldText, newText) {
    instance.children = newText
  },
  commitUpdate(instance, container, type, oldProps, newProps, fiber) {
    const { key } = fiber
    const { children, ...attrs } = newProps

    const next = {
      type,
      props: attrs,
    }
    if (key) {
      next.key = key
    }
    // put text inside
    if (isArray(children)) {
      if (!children.some(item => typeof item === 'object')) {
        next.children = children.map(str => createTextNode(str))
      }
    }
    else if (isString(children)) {
      next.children = [createTextNode(children)]
    }

    Object.assign(instance, next)
    container.update(instance, next)
  },

  shouldSetTextContent() {
    return false
  },
  resetTextContent(_instance) {},

  prepareForCommit(_container) {},
  resetAfterCommit(container) {
    if (notify) {
      notify.updated(container.data)
    }
  },
}

const reconcilerInstance = Reconciler(HostConfig)

let rootContainerInstance = null

export function render(element, { mounted, updated, created }) {
  if (!rootContainerInstance) {
    rootContainerInstance = reconcilerInstance.createContainer(container, false, false)
  }
  return reconcilerInstance.updateContainer(element, rootContainerInstance, null, () => {
    notify = { mounted, updated, created }
    created && created(container)
    mounted(container.data)
  })
}

export function registerApp(register) {
  const options = register ? register(context) : {}
  // eslint-disable-next-line no-undef
  App(options)
}

export function registerPage(register, dataKey, Component, props) {
  const options = register ? register(context) : {}
  const behavior = dataKey && Component ? createBehavior(dataKey, Component, props) : null
  const behaviors = behavior ? [behavior] : []
  // eslint-disable-next-line no-undef
  Page({
    ...options,
    behaviors: [...(options.behaviors || []), ...behaviors],
  })
}

export function createBehavior(dataKey, Component, props) {
  // eslint-disable-next-line no-undef
  return Behavior({
    data: {
      [dataKey]: null,
    },
    lifetimes: {
      attached() {
        render(createElement(Component, props), {
          mounted: (data) => {
            this.setData({
              [dataKey]: data,
            })
          },
          updated: (data) => {
            this.setData({
              [dataKey]: data,
            })
          },
        })
      },
    },
  })
}

export function runApp(App, regApp, regPage) {
  let count = 0
  return function(isApp = !count) {
    if (isApp) {
      registerApp(regApp)
    }
    else {
      registerPage(regPage, 'vdom', App)
    }
    count ++
  }
}
