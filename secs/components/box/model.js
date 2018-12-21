import { Model } from 'nautil'

export default class BoxModel extends Model {

  /**
   * 默认的模型上都使用$开头的方法或属性
   * 不是$开头的方法或属性表示接收到的流
   * 开发者不能自己自定义$开头的数据，如果这么做，会被自动忽略，无法在视图中使用
   */
  $data = {
    title: '',
  }

  $state = {
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
      options: this.$state.options.map(option => {
        if (option.id === id) {
          option.selected = true
        }
        else {
          option.selected = false
        }
        return option
      })
    }))
  }
}
