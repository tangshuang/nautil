const digest = Symbol('digest')

export class Store {
  constructor(state) {}
  $set(key, value) {}
  $get(key) {}
  $del(key) {}
  [digest]() {}
}
