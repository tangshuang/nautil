import Component from '../core/component.js'

export class Line extends Component {
  static props = {
    width: Number,
    thick: Number,
    color: String,
  }
  static defaultProps = {
    width: '100%',
    thick: 1,
    color: '#888888',
  }
}
export default Line
