import { Action } from 'nautil'

export default class BoxAction extends Action {

  /**
   * action上的所有方法都支持外部传进来覆盖
   * 但是如果没有在action中，在组件上传无效果
   * 外部传的时候为on-toggle
   */
  toggle(stream) {
    return stream.map(e => e.pageX).map(pageX => ({ pageX }))
  }

  select(stream) {
    return stream.map(item => ({ selected: item.id }))
  }

  // 多选，选中某一个时
  multiSelect(stream) {
    return stream.map((item) => ({ multiselected: item.id }))
  }

}
