import { Enum, List, Tuple, Any, Prototype } from 'tyshemo'
import { Store, PROXY_STORE } from './core/store.js'
import { Model, PROXY_MODEL } from './core/model.js'
import { isObject, isInstanceOf } from './utils.js'

export {
  Prototype,
  Null, Undefined, Any,
  Numeric, Int, Float, Negative, Positive, Finity, Zero,
  String8, String16, String32, String64, String128,

  Type, type,
  Dict, dict,
  List, list,
  Tuple, tuple,
  Enum, enumerate,
  Range, range,

  Rule,
  asynchronous,
  match,
  determine,
  shouldmatch,
  shouldnotmatch,
  ifexist,
  ifnotmatch,
  shouldexist,
  shouldnotexist,
  beof,
  equal,
  lambda,

  Ty,
  TyError,
} from 'tyshemo'

export const Handling = new Enum([
  Function,
  new List([Function]),
])

export const State = new Prototype({
  name: 'State',
  validate: value => isObject(value) && (isInstanceOf(value[PROXY_STORE], Store) || isInstanceOf(value[PROXY_MODEL], Model)),
})

export const Binding = new Enum([
  State,
  Store,
  Model,
  new Tuple([Any, Function]),
])

/**
 * which is always used in styles rules, such as `12px`, `15`, `center`...
 */
export const Unit = new Enum([
  String,
  Number,
])
