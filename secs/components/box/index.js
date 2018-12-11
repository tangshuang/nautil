import { Component } from 'nautil'

export default class Box extends Component {
  static controller = import('./controller')
  static model = import('./model')
  static template = import('./view.html')
  static preload = import('../../pages/loading.html')
  static stylesheet = import('./style.scss')

  onClickItem(item) {
    this.$emit('select', item)
  }
}
