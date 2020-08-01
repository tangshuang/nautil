import { Component } from '../core/component.js'

export class Line extends Component {
  static props = {
    length: Number,
    thick: Number,
    color: String,
  }
  static defaultProps = {
    length: 1,
    thick: 1,
    color: '#888888',
  }
}
export default Line
