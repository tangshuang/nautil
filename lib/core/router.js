export class Router {
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

export default Router
