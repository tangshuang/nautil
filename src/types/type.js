import Rule from './rule.js'
import Dict from './dict.js'
import List from './list.js'
import Enum from './enum.js'
import { isArray, inArray, isBoolean, isNumber, isObject, isNaN, isString, isFunction, isSymbol, isConstructor, isInstanceOf, map, defineProperty } from '../utils/index.js'
import { xError, Error } from './error.js'

export class Type {
  constructor(...patterns) {
    defineProperty(this, 'id', Date.now()  + '.' + parseInt(Math.random() * 10000))
    defineProperty(this, 'mode', 'none', true)
    defineProperty(this, 'name', 'Type', true, true)
    defineProperty(this, 'patterns', patterns)

    let rules = patterns.map((rule) => {
      // if rule is an object, it will be converted to be a shallow object
      // if the value of a property is an object, it will be converted to be a Dict
      // if the value of a property is an array, it will be converted to be a List
      // if rule is an array, it will be converted to be a 'List'
      return map(rule, item => isObject(item) ? Dict(item) : isArray(item) ? List(item) : item)
    })
    defineProperty(this, 'rules', rules)
  }
  /**
   * validate whether the argument match the rule
   * @param {*} value
   * @param {*} rule
   */
  validate(value, rule) {
    // custom rule
    // i.e. (new Type(new Rule(value => typeof value === 'object'))).assert(null)
    if (isInstanceOf(rule, Rule)) {
      let res = rule.validate(value)
      // if validate return an error
      if (isInstanceOf(res, Error)) {
        return xError(res, { value, rule, type: this, action: 'validate' })
      }
      // if validate return false
      else if (isBoolean(res) && !res) {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
      // if validate return true
      else {
        return null
      }
    }

    // NaN
    // i.e. (new Type(NaN)).assert(NaN)
    if (typeof rule === 'number' && isNaN(rule)) {
      if (typeof value === 'number' && isNaN(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // Number
    // i.e. (new Type(Number).assert(1))
    if (rule === Number) {
      if (isNumber(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // Boolean
    // i.e. (new Type(Boolean)).assert(true)
    if (rule === Boolean) {
      if (isBoolean(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // String
    // i.e. (new Type(String)).assert('name')
    if (rule === String) {
      if (isString(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // regexp
    // i.e. (new Type(/a/)).assert('name')
    if (isInstanceOf(rule, RegExp)) {
      if (!isString(value)) {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
      if (rule.test(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // Function
    // i.e. (new Type(Function)).assert(() => {})
    if (rule === Function) {
      if (isFunction(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // Array
    // i.e. (new Type(Array)).assert([])
    if (rule === Array) {
      if (isArray(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    // object
    // i.e. (new Type(Object).assert({}))
    if (rule === Object) {
      if (isObject(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    if (rule === Symbol) {
      if (isSymbol(value)) {
        return null
      }
      else {
        return new Error('refuse', { value, rule, type: this, action: 'validate' })
      }
    }

    if (isArray(rule) && isArray(value)) {
      let rules = rule
      let items = value
      let ruleCount = rules.length
      let itemCount = items.length

      // array length should equal in strict mode
      if (this.mode === 'strict') {
        if (ruleCount !== itemCount) {
          return new Error('dirty', { value, rule, type: this, action: 'validate', length: ruleCount })
        }
      }

      // if arguments.length is bigger than rules.length, use Enum to match left items
      let index = 0
      for (let i = 0; i < ruleCount; i ++) {
        let value = items[i]
        let rule = rules[i]

        if (isInstanceOf(rule, Rule)) {
          let error = rule.validate(value)

          // use rule to override property when not match
          // override value and check again
          if (isFunction(rule.override)) {
            value = rule.override(error, i, items) || items[i]
            error = rule.validate(value)
          }

          if (error) {
            return xError(error, { value, rule, type: this, action: 'validate', index })
          }
          else {
            continue
          }
        }

        // normal validate
        let error = this.validate(value, rule)
        if (error) {
          return xError(error, { value, rule, type: this, action: 'validate', index })
        }

        index = i
      }
      // if target length is greater than rule length
      if (ruleCount && itemCount > ruleCount) {
        let RestType = ruleCount > 1 ? Enum(...rules) : rules[0]
        for (let i = index+1; i < itemCount; i ++) {
          let value = items[i]
          // normal validate
          let error = this.validate(value, RestType)
          if (error) {
            return xError(error, { value, rule: RestType, type: this, action: 'validate', index })
          }
        }
      }

      return null
    }

    if (isObject(rule) && isObject(value)) {
      let rules = rule
      let target = value
      let ruleKeys = Object.keys(rules)
      let targetKeys = Object.keys(target)

      if (this.mode === 'strict') {
        // properties should be absolutely same
        for (let i = 0, len = targetKeys.length; i < len; i ++) {
          let key = targetKeys[i]
          // target has key beyond rules
          if (!inArray(key, ruleKeys)) {
            return new Error('overflow', { value, rule, type: this, action: 'validate', key, keys: ruleKeys })
          }
        }
      }

      for (let i = 0, len = ruleKeys.length; i < len; i ++) {
        let key = ruleKeys[i]
        let rule = rules[key]
        let value = target[key]

        // not found some key in target
        // i.e. should be { name: String, age: Number } but give { name: 'tomy' }, 'age' is missing
        if (!inArray(key, targetKeys)) {
          // IfExists:
          if (isInstanceOf(rule, Rule) && this.mode !== 'strict') {
            let error = rule.validate(value)

            // use rule to override property when not exists
            // override value and check again
            if (isFunction(rule.override)) {
              value = rule.override(error, key, target) || target[key]
              error = rule.validate(value)
            }

            if (!error) {
              continue
            }
          }

          return new Error('missing', { value, rule, type: this, action: 'validate', key })
        }

        if (isInstanceOf(rule, Rule)) {
          let error = rule.validate(value)

          // use rule to override property when not match
          // override value and check again
          if (isFunction(rule.override)) {
            value = rule.override(error, key, target) || target[key]
            error = rule.validate(value)
          }

          if (error) {
            return xError(error, { value, rule, type: this, action: 'validate', key })
          }
          else {
            continue
          }
        }

        // normal validate
        let error = this.validate(value, rule)
        if (error) {
          return xError(error, { value, rule, type: this, action: 'validate', key })
        }
      }

      return null
    }

    // is the given value, rule should not be an object/instance
    // i.e. (new Type('name')).assert('name')
    if (!isInstanceOf(rule, Object) && value === rule) {
      return null
    }

    // instance of a class
    // i.e. (new Type(Person)).assert(person)
    if (isConstructor(rule) && isInstanceOf(value, rule)) {
      return null
    }

    // instance of Type
    // const BooksType = List(BookType)
    // BooksType.assert([{ name: 'Hamlet', price: 120.34 }])
    if (isInstanceOf(rule, Type)) {
      if (this.mode === 'strict') {
        rule = rule.strict
      }
      let error = rule.catch(value)
      if (error) {
        return xError(error, { value, rule, type: this, action: 'validate' })
      }

      return null
    }

    return new Error('refuse', { value, rule, type: this, action: 'validate' })
  }
  assert(...targets) {
    let rules = this.rules

    if (targets.length !== rules.length) {
      throw new Error('dirty', { type: this, action: 'assert', length: this.rules.length })
    }

    for (let i = 0, len = targets.length; i < len; i ++) {
      let value = targets[i]
      let rule = rules[i]
      let error = this.validate(value, rule)
      if (error) {
        throw xError(error, { value, rule, type: this, action: 'assert' })
      }
    }
  }
  catch(...targets) {
    try {
      this.assert(...targets)
      return null
    }
    catch(error) {
      return error
    }
  }
  test(...targets) {
    let error = this.catch(...targets)
    return !error
  }

  /**
   * track targets with type sync
   * @param {*} targets
   */
  track(...targets) {
    let error = this.catch(...targets)
    let defer = Promise.resolve(error)
    return {
      with: (fn) => defer.then((error) => {
        if (error && isFunction(fn)) {
          fn(error, targets, this)
        }
        return error
      }),
    }
  }

  /**
   * track targets with type async
   * @param {*} targets
   * @example
   * SomeType.trace(target).with((error, [target], type) => { ... })
   */
  trace(...targets) {
    let defer = new Promise((resolve) => {
      Promise.resolve().then(() => {
        let error = this.catch(...targets)
        resolve(error)
      })
    })
    return {
      with: (fn) => defer.then((error) => {
        if (error && isFunction(fn)) {
          fn(error, targets, this)
        }
        return error
      }),
    }
  }

  toBeStrict(mode = true) {
    this.mode = mode ? 'strict' : 'none'
    return this
  }
  get strict() {
    let ins = new Type(...this.patterns)
    ins.toBeStrict()

    let keys = Object.keys(this)
    keys.forEach((key) => {
      ins[key] = this[key]
    })

    return ins
  }
  get Strict() {
    return this.strict
  }

  // use name when convert to string
  toString() {
    return this.name
  }
}
