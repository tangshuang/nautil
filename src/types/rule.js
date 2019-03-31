import Type from './type.js'
import { isFunction, isInstanceOf, isNumber, isString, isBoolean } from '../utils/index.js'
import { xError, Error } from './error.js'

export class Rule {
  /**
   *
   * @param {*} name
   * @param {*} validate should must return an error or null
   * @param {*} override
   */
  constructor(name, validate, override) {
    if (isFunction(name)) {
      override = validate
      validate = name
      name = null
    }

    this.validate = validate
    this.override = override
    this.name = name
  }
  toString() {
    return this.name
  }
}

// create a simple rule
function makeRule(name, determine, message = 'refuse') {
  if (isFunction(name)) {
    message = determine
    determine = name
    name = null
  }

  return new Rule(name, function(value) {
    const msg = isFunction(message) ? message(value) : message
    if ((isFunction(determine) && !determine.call(this, value)) || (isBoolean(determine) && !determine)) {
      return new Error(msg, { value, rule: this, action: 'rule' })
    }
  })
}

// create a rule generator (a function) which return a rule
// fn should must return a rule
function makeRuleGenerator(name, fn) {
  return function(...args) {
    let rule = fn(...args)
    rule.arguments = args
    rule.name = name
    return rule
  }
}

export const Null = makeRule('Null', (value) => value === null)
export const Undefined = makeRule('Undefined', (value) => value === undefined)
export const Any = makeRule('Any', true)
export const Numeric = makeRule('Numeric', (value) => isNumber(value) || (isString(value) && /^[0-9]+(\.{0,1}[0-9]+){0,1}$/.test(value)))

/**
 * Async rule
 * @param {Function} fn which can be an async function and should return a rule
 */
export const Async = makeRuleGenerator('Async', function(fn) {
  const rule = new Rule(function(value) {
    if (this.__await__) {
      let rule = this.__await__
      if (isInstanceOf(rule, Rule)) {
        let error = rule.validate(value)
        return xError(error, { value, rule, action: 'rule' })
      }
      else if (isInstanceOf(rule, Type)) {
        let error = rule.catch(value)
        return xError(error, { value, rule, action: 'rule' })
      }
      else {
        let type = new Type(rule)
        let error = type.catch(value)
        return xError(error, { value, rule, action: 'rule' })
      }
    }
    return true
  })
  rule.__async__ = Promise.resolve().then(() => fn()).then((type) => {
    rule.__await__ = type
    return type
  })
  return rule
})

/**
 * Verify a rule by using custom error message
 * @param {Rule|Type|Function} rule
 * @param {String|Function} message
 */
export const Validate = makeRuleGenerator('Validate', function(rule, message) {
  if (isFunction(rule)) {
    return makeRule(rule, message)
  }

  if (isInstanceOf(rule, Rule)) {
    return makeRule((value) => rule.validate(value), message)
  }

  if (isInstanceOf(rule, Type)) {
    return makeRule((value) => rule.test(value), message)
  }

  let type = new Type(rule)
  return Validate(type, message)
})

/**
 * the passed value should match all passed rules
 * @param  {...any} rules
 * @example
 * const SomeType = Dict({
 *   value: ShouldMatch(
 *    Validate(Number, 'it should be a number'),
 *    Validate(value => value === parseInt(value, 10), 'it should be an int number')
 *   )
 * })
 */
export const ShouldMatch = makeRuleGenerator('ShouldMatch', function(...rules) {
  return new Rule(function(value) {
    const validate = (value, rule) => {
      if (isInstanceOf(rule, Rule)) {
        let error = rule.validate(value)
        return xError(error, { value, rule: this, action: 'rule' })
      }

      if (isInstanceOf(rule, Type)) {
        let error = rule.catch(value)
        return xError(error, { value, rule: this, action: 'rule' })
      }

      let type = new Type(rule)
      return validate(value, type)
    }
    for (let i = 0, len = rules.length; i < len; i ++) {
      let rule = rules[i]
      let error = validate(value, rule)
      if (error) {
        return error
      }
    }
  })
})

/**
 * If the value exists, use rule to validate.
 * If not exists, ignore this rule.
 * @param {*} rule
 */
export const IfExists = makeRuleGenerator('IfExists', function(rule) {
  if (isInstanceOf(rule, Rule)) {
    return new Rule(function(value) {
      if (value === undefined) {
        return
      }
      let error = rule.validate(value)
      return xError(error, { value, rule: this, action: 'rule' })
    })
  }

  if (isInstanceOf(rule, Type)) {
    return new Rule(function(value) {
      if (value === undefined) {
        return
      }
      let error = rule.catch(value)
      return xError(error, { value, rule: this, action: 'rule' })
    })
  }

  let type = new Type(rule)
  return IfExists(type)
})

/**
 * If the value not match rule, use defaultValue as value.
 * Notice, this will modify original data, which may cause error, so be careful.
 * @param {*} rule
 * @param {*} [defaultValue]
 * @param {function} calculate a function to calculate new value with origin old value
 */
export const IfNotMatch = makeRuleGenerator('IfNotMatch', function(rule, defaultValue, calculate) {
  if (isFunction(defaultValue)) {
    calculate = defaultValue
    defaultValue = undefined
  }

  if (isInstanceOf(rule, Rule)) {
    return new Rule(function(value) {
      let error = rule.validate(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }, function(error, prop, target) {
      if (error) {
        target[prop] = isFunction(calculate) ? calculate(target[prop], defaultValue) : defaultValue
      }
    })
  }

  if (isInstanceOf(rule, Type)) {
    return new Rule(function(value) {
      let error = rule.catch(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }, function(error, prop, target) {
      if (error) {
        target[prop] = isFunction(calculate) ? calculate(target[prop], defaultValue) : defaultValue
      }
    })
  }

  let type = new Type(rule)
  return IfNotMatch(type, defaultValue, calculate)
})

/**
 * determine which rule to use.
 * @param {function} factory a function to receive parent node of current prop, and return a rule
 * @example
 * const SomeType = Dict({
 *   name: String,
 *   isMale: Boolean,
 *   // data type check based on person.isMale
 *   touch: Determine(function(person) {
 *     if (person.isMale) {
 *       return String
 *     }
 *     else {
 *       return Null
 *     }
 *   }),
 * })
 */
export const Determine = makeRuleGenerator('Determine', function(factory) {
  let rule
  let isMade = false
  return new Rule(function(value) {
    if (!isMade) {
      return new Error('You should pass a rule to Determine.', { value, rule: this })
    }
    if (isInstanceOf(rule, Rule)) {
      let error = rule.validate(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }
    else if (isInstanceOf(rule, Type)) {
      let error = rule.catch(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }
    else {
      rule = new Type(rule)
      let error = rule.catch(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }
  }, function(error, porp, target) {
    rule = factory(target)
    isMade = true
  })
})

/**
 * If the value exists, and if the value not match rule, use defaultValue as value.
 * If not exists, ignore this rule.
 * @param {*} rule
 * @param {*} [defaultValue]
 * @param {function} calculate a function to calculate new value with origin old value
 */
export const IfExistsNotMatch = makeRuleGenerator('IfExistsNotMatch', function(rule, defaultValue, calculate) {
  if (isFunction(defaultValue)) {
    calculate = defaultValue
    defaultValue = undefined
  }

  if (isInstanceOf(rule, Rule)) {
    return new Rule(function(value) {
      if (value === undefined) {
        return
      }
      let error = rule.validate(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }, function(error, prop, target) {
      if (error) {
        target[prop] = isFunction(calculate) ? calculate(target[prop], defaultValue) : defaultValue
      }
    })
  }

  if (isInstanceOf(rule, Type)) {
    return new Rule(function(value) {
      if (value === undefined) {
        return
      }
      let error = rule.catch(value)
      return xError(error, { value, rule: this, action: 'rule' })
    }, function(error, prop, target) {
      if (error) {
        target[prop] = isFunction(calculate) ? calculate(target[prop], defaultValue) : defaultValue
      }
    })
  }

  let type = new Type(rule)
  return IfExistsNotMatch(type, defaultValue, calculate)
})

/**
 * Whether the value is an instance of given class
 * @param {*} rule should be a class constructor
 */
export const InstanceOf = makeRuleGenerator('InstanceOf', function(rule) {
  return makeRule((value) => isInstanceOf(value, rule, true))
})

/**
 * Whether the value is eqaul to the given value
 * @param {*} rule
 */
export const Equal = makeRuleGenerator('Equal', function(rule) {
  return makeRule((value) => value === rule)
})

/**
 * Wether the value is a function
 * @param {Tuple} InputType
 * @param {Any} OutputType
 */
export const Lambda = makeRuleGenerator('Lambda', function(InputType, OutputType) {
  if (!isInstanceOf(InputType, Type)) {
    InputType = new Type(InputType)
  }
  if (!isInstanceOf(OutputType, Type)) {
    OutputType = new Type(OutputType)
  }

  return new Rule(function(value) {
    if (!isFunction(value)) {
      return new Error('refuse', { value, rule: this, action: 'rule' })
    }
  }, function(error, prop, target) {
    if (!error) {
      let fn = target[prop].bind(target)
      let lambda = function(...args) {
        InputType.assert(...args)
        let result = fn(...args)
        OutputType.assert(result)
        return result
      }
      target[prop] = lambda
    }
  })
})
