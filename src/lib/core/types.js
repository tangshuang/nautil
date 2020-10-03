import {
  Enum,
  List,
  Tuple,
  Any,
} from 'tyshemo'

export const Handling = new Enum([
  Function,
  new List([Function]),
])

export const Binding = new Tuple([Any, Function])

/**
 * which is always used in styles rules, such as `12px`, `15`, `center`...
 */
export const Unit = new Enum([
  String,
  Number,
])
