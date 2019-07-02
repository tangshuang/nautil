import { Component } from '../core/component.js'

export class Line extends Component {
  static validateProps = {
    length: Number,
    thickness: Number,
    color: String,
  }
  static defaultProps = {
    length: Infinity,
    thickness: 1,
    color: '#888888',
  }
}
export default Line
