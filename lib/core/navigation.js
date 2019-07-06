export class Navigation {
  constructor(options = {}) {
    this.init(options)
  }
  init() {}

  on(match, callback, priority) {}
  off(match, callback) {}

  go(name, params) {}
  open(name, params) {}
  back(count) {}
}

Navigation.defualtOptions = {
  maxHistoryLength: 20,
}

export default Navigation
