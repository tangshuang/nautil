import { Controller, Ajax } from 'nautil'

export default class SampleController extends Controller {


  // 其实，在controller里面也可以通过this.data$()获取数据，但是这样的话，就会让controller和model的耦合度变高，因此，要杜绝这种做法

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
