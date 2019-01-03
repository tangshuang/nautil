import { Component } from 'nautil'

export default class DealFormModule extends Component {
  static controller = import('./controller')
  static model = import('./model')
  static view = import('./view.jsx')
}
