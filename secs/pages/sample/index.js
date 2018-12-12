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

  // 对模板进行解析之后得到的模板对象型结构，开发者可以修改这个对象来调整模板结构。
  // vhtml只会用到一次，onParsed会在所有生命周期中只会执行一次。onParsed结束之后，vhtml就会被销毁。因此，只有一次修改模板结构的机会。
  onParsed(vhtml) {}
  
  // 生成virtual dom
  // 也会只执行一次，执行完之后销毁vdom。
  onCompiled(vdom) {}
  
  // 生成真实的dom之后，也只执行一次
  onMounted($element) {}
  
  // 当model变化，dom更新之后执行。会执行多次。
  onUpdated($element) {}
  
  // dom被销毁，组件被销毁之后执行，只执行一次
  onDestory($element) {}
}
