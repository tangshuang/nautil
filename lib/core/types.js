import { Enum, List, Tuple, Any } from 'tyshemo'
import Store from './store.js'
import Model from './model.js'

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

export const Binding = new Enum([
  Store,
  Model,
  new Tuple([Any, Function]),
])
