import { Component } from 'nautil'

export default class Box extends Component {
  static controller = import('./controller')
  static model = import('./model')
  static template = import('./view.jsx')
  static preload = import('../../pages/loading.jsx')
  static stylesheet = import('./style.scss')
}
