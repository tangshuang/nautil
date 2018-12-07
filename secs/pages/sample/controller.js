import { Controller } from 'nautil'

export default class SamplePageController extends Controller {
  input(observable) {
    return observable.flatMap(e => ({ id: e.target.value }))
  }
  click(observable) {
  }
  toggle(observable) {
    return observable.switchMap(isShow => this.$set('isShow', !isShow))
  }
}
