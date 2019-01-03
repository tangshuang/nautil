import { Component } from 'nautil'

export default class Box extends Component {
  static detector = import('./detector')
  static model = import('./model')
  static view = import('./view.jsx')
  static stylesheet = import('./style.scss')
}
