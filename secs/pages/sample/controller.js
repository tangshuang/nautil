import { Controller, Ajax } from 'nautil'

export default class SampleController extends Controller {

  calling$ = new Ajax({
    url: 'xxx',
    header: 'xxx',

    // Ajax的钩子函数能独立触发model的变化
    onRequest: stream => stream.map(() => ({ showLoading: true })),
    onCompleted: stream => stream.map(() => ({ showLoading: false })),
  })

  input(stream) {
    return stream.map(e => ({ id: e.target.value }))
  }

  click(stream) {
    return stream.map(e => ({ pageX: e.target.pageX, pageY: e.target.pageY }))
      .switchMap(({ pageX, pageY }) => this.calling$.post({ pageX, pageY }))
  }

  toggle(stream) {
    // Ajax.post方法返回null，因此，不会更新model，也不会触发视图更新
    return stream.switchMap(isShow => this.calling$.post({ isShow }))
  }

  changeTitle(stream) {
    return stream.map(title => ({
      // 触发深层级属性变化的方法
      'obj.title': title
    }))
  }

}
