import { Component, Ajax } from 'nautil'

export default class SamplePage extends Component {
  static controller = import('./controller')
  static model = import('./model')
  static template = import('./view.jsx')
  static loading = import('../loading.jsx')
  static stylesheet = import('./style.scss')

  // 准备一个ajax请求流管理器
  // 以$结尾的属性也会被排除出数据模型，而被认为是一个stream
  cats$ = new Ajax({
    mode: 'switch',
    url: 'https://www.myserver.com/api/2.0/cats'
  })


  // 下面的是钩子函数

  /**
   * 初始化模型结束时候执行，这时组件的模型还未真正生成，直到init返回的stream结束才会产生真正的组件模型
   * 你可以在这里面修改初始数据
   * 下面的例子将通过请求得到的cats合并到data中作为初始数据
   * init在整个周期中只执行一次
   * @param {*} stream
   */
  init(stream) {
    return stream.switchMap(data => this.cats$.get().map(cats => Object.assign({}, data, { cats })))
  }

  // 父级作用域传进来的props值发生变化，或第一次接收到时执行
  // props会被赋值给data，并实现双向绑定
  // 不存在于data和form中的props会被本组件直接忽略
  // 每次props发生变化，都会被执行，你可以在这里决定是否采纳props的变化结果
  inherit(stream) {
    return stream.map(data => data)
  }

  // 接收到子作用域传来的反写数据
  // 当子作用域的model被修改完，但还没有引发界面变化时执行，
  // 数据被更改之后，父级作用域这个时候会收集自己和子作用域之间相互绑定好的数据，并调用onAdmit去更改自己的模型
  // 每次子作用域反写都被执行，你可以在这里决定是否采纳反写结果
  // 同样的道理，只有被双向绑定的props才会被更新，即使admit返回的结果中存在父级作用域model上存在的属性，但是它不再双向绑定的属性列表中，那么它会被忽略
  admit(stream) {
    return stream.map(data => data)
  }

  // 数据经过一系列处理之后，准备马上写入model时
  // 你还有一次机会对马上要写入model的数据进行最终的调整
  // 它的返回结果将会被认作一个完整的数据去全量更新模型
  // data是经过合并后最终的数据，不单单包括变化的属性
  // 这里需要注意，计算属性在receive之后不会再重复计算
  receive(stream) {
    return stream.map(data => ({ uid: data.user.uid, ...data }))
  }

  /**
   * 数据从model流向视图前执行，它的返回结果会被作为视图最终的渲染依据
   * 会被多次执行，在每次模型发生变化，视图准备更新时都会执行
   * 你可以在这里map模型数据为视图最终需要的数据
   * data和receive的输出结果一致
   * @param {*} stream
   */
  contribute(stream) {
    return stream.map(data => ({ size: Object.keys(data).length, ...data }))
  }


  // 下面的生命周期函数里面支持jquery编程
  // 但不能获取任何和model、controller相关的信息，它和nautil的响应式编程是完全隔绝的两套逻辑
  // 但是，任何对真实DOM的操作、修改，都会反馈到系统内部，实现对虚拟DOM的自动更新，当然，这样做很可能会丢失元编程的响应式效果

  // 生成真实的dom之后，只执行一次
  onMounted($element) {
    this.data$().subscribe((data) => {
      $element.find('.test').append('<div class="name">' + data.name + '</div>') // 修改了原始的DOM结构，同时会修改virtual dom，但是由于它是静态的，所以不会有任何跟model的互动
      $element.find('.test').on('click', this._click) // 完全是jquery的编程思维
      // 这里绑定的事件和controller中的响应式程序不冲突，它们都是基于DOM的原生事件系统
    })
  }

  _click = (e) => {}

  // 当model变化，dom更新之后执行。会执行多次。
  onUpdated($element) {
    this.data$().subscribe((data) => {
      $element.find('.test name').text(data.name) // 和onMounted中不同，onUpdated会在每次更新完DOM之后执行，而且，不会修改virtual dom，也就是说
      // 这里的代码会反复执行，因此，如果你在这里操作了dom，一定要特别小心
    })
  }

  // dom被销毁，组件被销毁之前执行，只执行一次
  onDestory($element) {
    $element.find('.test').off('click', this._click)
  }

}
