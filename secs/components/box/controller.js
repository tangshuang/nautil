import { Controller } from 'nautil'

export default class BoxController extends Controller {

  /**
   * controller上的所有方法都支持外部传进来覆盖
   * 但是如果没有在controller中，在组件上传无效果
   * 外部传的时候为onToggle或on-toggle
   */

  toggle(stream) {
    return stream.map(e => e.pageX).map(pageX => ({ pageX }))
  }
  select(stream) {
    return stream.map(item => ({ selected: item.id }))
  }
}
