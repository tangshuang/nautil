import { Component } from 'nautil'

export default class SamplePage extends Component {
  static controller = import('./controller')
  static model = import('./model')
  static template = import('./view.jsx')
  static loading = import('../loading.jsx')
  static stylesheet = import('./style.scss')


  // 下面的生命周期函数里面支持jquery编程
  // 但不能获取任何和model、controller相关的信息，它和nautil的元编程是完全隔绝的两套逻辑
  // 但是，任何对真实DOM的操作、修改，都会反馈到系统内部，实现对虚拟DOM的自动更新，当然，这样做很可能会丢失元编程的响应式效果

  // 生成真实的dom之后，只执行一次
  onMounted($element) {}

  // 当model变化，dom更新之后执行。会执行多次。
  onUpdated($element) {}

  // dom被销毁，组件被销毁之前执行，只执行一次
  onDestory($element) {}

}
