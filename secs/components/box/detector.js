import { Detector } from 'nautil'

export default class BoxDetector extends Detector {

  /**
   * detector上的所有方法都支持外部传进来覆盖
   * 但是如果没有在detector中，在组件上传无效果
   * 外部传的时候为onToggle
   */
  onToggle(stream) {
    return stream.map(e => e.pageX).map(pageX => ({ pageX }))
  }

  onSelect(stream) {
    return stream.map(item => ({ selected: item.id }))
  }

  // 多选，选中某一个时
  onMultiSelect(stream) {
    return stream.map((item) => ({ multiselected: item.id }))
  }

}
