import React, { Fragment } from 'react'
import { each, map, isString, isEmpty, isArray, isObject } from 'ts-fns'
import ScopeX from 'scopex'

const REACT_PROPS_MAPPING = {
  for: 'htmlFor',
  readonly: 'readOnly',
  class: 'className',
}

const BUILT_IN_COMPONENTS = {
  Fragment,
}

function isExp(str) {
  return str[0] === '{' && str[str.length - 1] === '}'
}

function getExp(str) {
  return str.substring(1, str.length - 1).trim()
}

function makeLocalScope(args, params) {
  const locals = {}
  args.forEach((arg, i) => {
    locals[arg] = params[i]
  })
  return locals
}

function parseExp(exp, scopex) {
  return scopex.parse(exp)
}

function parseKey(str) {
  const matched = str.match(/([a-zA-Z0-9_$]+)(\((.*?)\))?(!(.*))?/)
  const [_, name, _p, _params, _m, _macro] = matched
  const params = isString(_params) ? _params.split(',').map(item => item.trim()).filter(item => !!item) : void 0
  const macro = _m ? _macro || true : void 0
  return [name, params, macro]
}

function findProp(obj, prop) {
  const keys = Object.keys(obj)
  for (let key of keys) {
    const [name, params, macro] = parseKey(key)
    if (name === prop) {
      return { name, params, macro, value: obj[key] }
    }
  }
}

function parseNest(nest, scopex, components) {
  const res = isArray(nest) ? [] : {}
  each(nest, (value, key) => {
    const [name, args, macro] = parseKey(key)
    const prop = REACT_PROPS_MAPPING[name] || name
    // renderer
    if (isArray(value) && macro) {
      if (args) {
        res[prop] = function(...params) {
          const locals = makeLocalScope(args, params)
          return parseJsx(value, scopex.$new(locals), components)
        }
      }
      else {
        res[prop] = parseJsx(value, scopex, components)
      }
      return
    }

    if (isString(value)) {
      const ie = isExp(value)
      const exp = ie ? getExp(value) : value
      if (args) {
        res[prop] = function(...params) {
          if (!ie) {
            return value
          }

          const locals = makeLocalScope(args, params)
          return parseExp(exp, scopex.$new(locals))
        }
      }
      else {
        res[prop] = ie ? parseExp(exp, scopex) : value
      }
      return
    }

    if (typeof value === 'object') {
      if (args) {
        res[prop] = function(...params) {
          const locals = makeLocalScope(args, params)
          return parseNest(value, scopex.$new(locals))
        }
      }
      else {
        res[prop] = parseNest(value, scopex)
      }
      return
    }

    res[prop] = value
  })
  return res
}

function composeComponents(components) {
  return {
    ...BUILT_IN_COMPONENTS,
    ...components,
  }
}

function parseJsx(jsx, scopex, components) {
  const [tag, nest, ...children] = jsx
  const name = isString(tag) && isExp(tag) ? parseExp(getExp(tag), scopex) : tag

  const comps = composeComponents(components)
  const Item = comps[name] ? comps[name] : name

  if (Item === null) {
    return null
  }

  const props = nest ? parseNest(nest, scopex) : {}

  return React.createElement(
    Item,
    props,
    ...map(children, (child) => parseJsx(child, scopex, components)),
  )
}

export function parseHyperJSON(hyperJSON, options = {}) {
  const { scope = {}, components = {}, filters = {} } = options
  const render = findProp(hyperJSON)

  if (isEmpty(render)) {
    throw new Error('No render!')
  }

  const { value: jsx } = render
  const { props: attrs } = hyperJSON

  return function Component(props) {
    const locals = { ...scope, ...components }

    if (isString(attrs)) {
      locals[attrs] = props
    }
    else if (isArray(attrs)) {
      attrs.forEach((key) => {
        locals[key] = props[key]
      })
    }
    else if (isObject(attrs)) {
      each(attrs, (alias, key) => {
        locals[alias] = attrs[key]
      })
    }

    const scopex = new ScopeX(locals, { filters, loose: true })
    return parseJsx(jsx, scopex, components)
  }
}
