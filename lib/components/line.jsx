import { Component } from '../core/component.js'

export class Line extends Component {
  static validateProps = {
    width: Number,
    thickness: Number,
    color: String,
  }
  static defaultProps = {
    width: Infinity,
    thickness: 1,
    color: '#888888',
  }
}
export default Line
