import { Model } from 'nautil'
import { mapAssign } from 'nautil/operators'

export default class BoxModel extends Model {

  static data = {
    title: '',
  }

  static state = {
    options: [
      { id: 'xxx', label: 'test1', selected: false },
    ],
  }

  /**
   * 收到来自selected属性的改变流
   * @param {*} stream
   */
  selected(stream) {
    return stream.switchMap((id) =>
      this.data$('options')
        .map(options => ({
          options: mapAssign(options, item => ({ selected: item.id !== id })) // options.map(item => Object.assign({}, item, { selected: item.id !== id }))
        }))
    )
  }

  // 通过multiselect的操作，使得只选中其中某一个而不产生其他副作用
  multiselected(stream) {
    return stream.switchMap((id) =>
      this.data$('options')
        .map(options => ({
          options: options.map(item => item.id === id ? Object.assign({}, item, { selected: !item.selected }) : item)
        }))
    )
  }

}
