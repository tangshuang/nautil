export class Router {
  constructor(options = {}) {
    this.options = options
    this.routes = options.routes

    this.status = ''
    this.state = {}

    this.init()
  }

  init() {}

  on(match, callback, priority = 10) {}
  off(match, callback) {}

  go(name, params = {}) {}
  back(count = 1) {}
}

export default Router
