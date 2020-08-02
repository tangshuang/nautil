import {
  Enum,
  List,
  Tuple,
  Any,
  Store,
  Model,
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

/**
 * which is always used in styles rules, such as `12px`, `15`, `center`...
 */
export const Unit = new Enum([
  String,
  Number,
])
