import { Model, Ajax } from 'nautil'

export default class SampleModel extends Model {
  
  // model中没有任何地方暴露当前model的完整状态，这样保证了model的干净，所有的stream只能完成自己的纯逻辑，而不能依赖model，这使得nautil更函数式编程
  // 这样的设计，还让开发者无法通过直接修改model来实现自己的目的，这样可以保证无状态的贯彻执行

  // 准备一个ajax请求流管理器
  // 以$结尾的属性也会被排除出数据模型，而被认为是一个stream
  cats$ = new Ajax({
    mode: 'switch',
    url: 'https://www.myserver.com/api/2.0/cats'
  })

  // 规定当前组件中可以使用的数据，通过属性传进来的数据会覆盖这里的值，但是，如果不在这里事先声明，那么传进来的值无效
  // 对data的修改，如果通过props传进来，还会反写给父级，实现双向绑定
  static data = {
    id: '',
    text: '',
  }

  // 当前组件的状态，基本和data用法一致，唯一不同的是，声明在state里面的数据，不会与父级作用域实现双向绑定，它只会在第一次实例化的时候使用一次props值
  // 也就是说通过props传进来的属性如果不存在于data中，而是存在于state，就不能被反写，只会在本组件实例化的时候被使用一次
  static state = {
    cats: [],
  }

  // 表单模型，可以设置字段的默认值，类型，校验器等信息
  // 将合并data，优先级最高
  static form = {}

  // 计算属性
  // 计算属性无法被修改，即使在props中传入，也不会覆盖，和state一样
  static computed = {
    count() {
      // 这里直接用this.cats而非this.data.cats，是因为这里的this并非指向当前实例，而是指向数据，
      // 由于data和state最终会被合并，因此this其实是指向最终合并后的对象model，因此，model上是有cats的
      return this.cats.length
    }
  }

  /**
   * 接收到controller发来的修改id属性的请求时，可以进行二次修复，本质上也算是钩子函数
   * 它在全局钩子函数（除$consume外）被调用之后执行
   * 任何对id发出更改请求的，都会走到这个钩子，包括props的变化，子作用域的反写，controller的通知
   * 它的输出结果会被assign给model，因此，返回的stream的结果是id属性的新值
   * @param {*} stream
   */
  id(stream) {
    return stream.map(id => id + 1)
  }

  /**
   * isShow不是model上的属性，因此，它不代表一个属性的修改，它的作用是在流循环中，接收来自controller的一个isShow请求
   * 它仅响应controller的通知
   * nautil内部会自己去判断这个方法是否是model上的数据属性，不是的话，只会执行流循环逻辑
   * 它的返回结果是和model结构一致的对象，并且被assign到model上覆盖原有属性
   * @param {*} stream
   */
  isShow(stream) {
    return stream.map(v => ({ text: !!v }))
  }


  // 下面的是全局钩子函数

  // 父级作用域传进来的props值
  // props会被赋值给data，并实现双向绑定，
  // props会被赋值给state，只被赋值一次
  // 不存在于data、state和form中的props会被本组件直接忽略
  // 但前提是，计算属性无法被赋值，因此，如果props中传入的属性包含data上的计算属性，也会无效
  // 每次props发生变化，都会被执行，你可以在这里决定是否采纳props的变化结果
  $inherit(stream) {
    return stream.map(data => data)
  }

  // 接收到子作用域传来的反写数据
  // 当子作用域的react执行完毕，数据被更改之后，父级作用域这个时候会收集自己和子作用域之间相互绑定好的数据，并调用admit去更改自己的数据
  // 每次子作用域反写都被执行，你可以在这里决定是否采纳反写结果
  $admit(stream) {
    return stream.map(data => data)
  }

  // 数据进来的流，在接收到controller流来的数据时被调用
  $react(stream) {
    return stream.map(data => ({ id: data.id }))
  }

  /**
   * 初始化数据的时候执行，执行时，还未得到最终的初始数据，你可以在这里面修改初始数据
   * 下面的例子将通过请求得到的cats合并到data中作为初始数据
   * $init在整个周期中只执行一次
   * @param {*} stream
   */
  $int(stream) {
    return stream.switchMap(data => this.cats$.get().map(cats => Object.assign({}, data, { cats })))
  }

  // 数据出去的流，无论是controller中的$set还是$emit，所有的事件交互对数据的修改都会合并为一个最终的结果，而这个最终的结果会经过pipe流到视图层
  // 和其他钩子函数不同的时，$consume的结果不会被存储到model中，而是被直接消费
  $consume(stream) {
    return stream
  }

}
