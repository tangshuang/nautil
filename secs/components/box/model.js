import { Model } from 'nautil'

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
    return stream.map((id) => ({
      options: this.state.options.map(option => Object.assign({}, option, {
        selected: option.id === id
      }))
    }))
  }

}
