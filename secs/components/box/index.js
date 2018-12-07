import { Component } from 'nautil'

export default class Box extends Component {
  controller = import('./controller')
  model = import('./model')
  template = import('./view.html')
  preload = import('../../pages/loading.html')
  stylesheet = import('./style.scss')

  onClickItem(item) {
    this.$emit('select', item)
  }
}
