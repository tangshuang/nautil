import { Controller, Ajax } from 'nautil'

export default class SampleController extends Controller {

  calling$ = new Ajax({
    url: 'xxx',
    header: 'xxx'
  })

  input(stream) {
    return stream.map(e => ({ id: e.target.value }))
  }

  click(stream) {
    return stream.map(e => ({ pageX: e.target.pageX, pageY: e.target.pageY }))
      .switchMap(({ pageX, pageY }) => this.calling$.post({ pageX, pageY }))
  }

  toggle(stream) {
    return stream.switchMap(isShow => this.calling$.post({ isShow }))
  }

}
