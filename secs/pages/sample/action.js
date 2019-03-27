import { Action, Ajax } from 'nautil'

export default class SampleAction extends Action {

  calling$ = new Ajax({
    url: 'xxx',
    header: 'xxx',
  })

  press(stream) {
    return stream.map(e => e.pageX).switchMap((pageX) =>
      this.data$('mytest.title').switchMap(title =>
        this.switch$(this.changeTitle, title + pageX)
      )
    )
  }

  input(stream) {
    return stream.map(e => ({ id: e.target.value }))
  }

  click(stream) {
    return stream.map(e => ({ pageX: e.target.pageX, pageY: e.target.pageY }))
      .switchMap(({ pageX, pageY }) => this.calling$.post({ pageX, pageY }))
  }

  toggle(stream) {
    // Ajax.post方法返回null，因此，不会更新model，也不会触发视图更新
    // this.switch$发起一个新的控制流，它将脱离原始控制流单独运行，它的运行结果和所有控制流是一致的
    return stream.do(() => this.switch$(this.showLoading))
      .switchMap(isShow => this.calling$.post({ isShow }).map(res => res.data))
      .do(() => this.switch$(this.hideLoading))
      .map(data => ({ id: data.id }))
  }

  showLoading(stream) {
    return stream.map(() => ({ showLoading: true }))
  }

  hideLoading(stream) {
    return stream.map(() => ({ showLoading: false }))
  }

  changeTitle(stream) {
    return stream.map(title => ({
      // 触发深层级属性变化的方法
      ['obj.title']: title
    }))
  }

}
