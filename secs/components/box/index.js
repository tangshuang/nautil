import { Component } from 'nautil'

export default class Box extends Component {
  static action = import('./action')
  static model = import('./model')
  static view = import('./view.jsx')
  static style = import('./style.scss')
}
