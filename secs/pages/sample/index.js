import { Component } from 'nautil'
import Box from '../../components/box'

export default class SamplePage extends Component {
  controller = import('./pages/sample/controller')
  model = import('./pages/sample/model')
  template = import('./pages/sample/view.html')
  preload = import('./pages/loading.html')
  stylesheet = import('./pages/sample/style.scss')
  components = {
    Box,
  }
}
