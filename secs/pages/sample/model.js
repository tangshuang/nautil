import { Model } from 'nautil'

export default class SampleModel extends Model {

  // model中没有任何地方暴露当前model的完整状态，这样保证了model的干净，所有的stream只能完成自己的纯逻辑，而不能依赖model，这使得nautil更函数式编程
  // 这样的设计，还让开发者无法通过直接修改model来实现自己的目的，这样可以保证无状态的贯彻执行
  // 在模型中，可以使用this.data$()创建一个只运行一次的获取模型上的数据的流，但是得到的是一个深拷贝，不允许用户直接通过赋值的方式修改模型上的数据

  // 规定当前组件中可以使用的数据，通过属性传进来的数据会覆盖这里的值，但是，如果不在这里事先声明，那么传进来的值无效
  // 对data的修改，如果通过props传进来，还会反写给父级，实现双向绑定
  static data = {
    id: '',
    text: '',
    obj: {
      title: '',
      children: [],
    },
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
      // 这里直接用this.cats而非this.data.cats，是因为这里的this并非指向当前实例，而是指向模型，
      // 由于data和state最终会被合并，因此this其实是指向最终合并后的对象model，因此，model上是有cats的
      return this.cats.length
    }
  }

  /**
   * 接收到action发来的修改id属性的请求时，可以进行二次修复，本质上也算是钩子函数
   * 它在全局钩子函数（除consume外）被调用之后执行
   * 任何对id发出更改请求的，都会走到这个钩子，包括props的变化，子作用域的反写，action的通知
   * 它的输出结果会被assign给model，因此，返回的stream的结果是id属性的新值
   * @param {*} stream
   */
  id(stream) {
    return stream.map(id => id + 1)
  }

  /**
   * isShow不是model上的属性，因此，它不代表一个属性的修改，它的作用是在流循环中，接收来自action的一个isShow请求
   * 它仅响应action的通知
   * nautil内部会自己去判断这个方法是否是model上的数据属性，不是的话，只会执行流循环逻辑，但是不会patch到model上，因为model上根本没有这个属性
   * 正因为如此，在这种属性的结尾，必须调用this.fork$()来发起一个新的stream用以更新真正需要更新的属性值
   * this.fork$()返回结果为null的stream，所以，当前的这个stream不会产生任何效果。
   * this.fork$()会调起一个新的stream，它的结果会被认为是对model的修改，因此，它就像action的一个操作一样，会重新触发model上的方法
   * @param {*} stream
   */
  isShow(stream) {
    return stream.map(v => v === '' ? 'xx' : v)
      .switchMap(v =>
        this.fork$(stream => stream.map(() => ({ id: v })))
      )
  }

  /**
   * 定义深层级的属性的响应方法
   * @param {*} stream
   */
  ['obj.title'](stream) {
    return stream
  }

}
