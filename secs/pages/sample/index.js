import { Component, View } from 'nautil'
import Box from '../../components/box'

export default class SamplePage extends Component {
  static controller = import('./pages/sample/controller')
  static model = import('./pages/sample/model')
  static template = import('./pages/sample/view.html')
  static preload = import('./pages/loading.html')
  static stylesheet = import('./pages/sample/style.scss')
  static components = {
    Box,
    View,
  }

  onParse(e, template) {}
  onCompile(e, contents, model) {}
  onMount(e, $element, model) {}
  onUpdate(e, $element, model) {}
  onDestory(e, $element, model) {}
}
