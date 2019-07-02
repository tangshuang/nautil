import Component from '../core/component.js'
import Router from '../core/router.js'
import { enumerate } from './types.js'

export class Link extends Component {
  static injectProps = {
    $router: true,
  }
  static validteProps = {
    to: enumerate(String, Function, RegExp),
    params: Object,
    replace: Boolean,
    open: Boolean,
    $router: Router,
  }
  static defaultProps = {
    open: false,
    params: {},
    replace: false,
  }

  constructor(props) {
    super(props)
    this.go = this.go.bind(this)
  }

  go() {
    const { to, params, open, replace } = this.attrs
    if (open) {
      this.$router.open(open, params)
    }
    else {
      this.$router.go(to, params, replace)
    }
  }
}

export default Link
