import { Controller, Ajax } from 'nautil'

export default class SampleController extends Controller {

  calling$ = new Ajax({
    url: 'xxx',
    header: 'xxx'
  })

  input(observable) {
    return observable.map(e => ({ id: e.target.value }))
  }

  click(observable) {
    return observable.map(e => ({ pageX: e.target.pageX, pageY: e.target.pageY }))
      .switchMap(({ pageX, pageY }) => this.calling$.post({ pageX, pageY }))
  }

  toggle(observable) {
    return observable.switchMap(isShow => this.calling$.post({ isShow }))
  }

}
