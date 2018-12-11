import { Model, Ajax } from 'nautil'

export default class DefaultModel extends Model {

  cats$ = new Ajax({
    mode: 'switch',
    url: 'https://www.myserver.com/api/2.0/cats'
  })

  // 规定当前组件中可以使用的数据，通过属性传进来的数据会覆盖这里的值，但是，如果不在这里事先声明，那么传进来的值无效
  // 对data的修改，如果通过props传进来，还会反写给父级，实现双向绑定
  data = {
    id: '',
    text: '',
    cats: [],
  }

  // 当前组件的状态，基本和data用法一致，唯一不同的是，声明在state里面的数据，不会与父级作用域实现双向绑定，它只会在第一次实例化的时候使用一次props值
  // 也就是说通过props传进来的属性如果不存在于data中，而是存在于state，就不能被反写，只会在本组件实例化的时候被使用一次
  state = {
    // 计算属性
    // 计算属性无法被修改，因此，放在data中也无法反写
    // 但是，为了更便于理解，计算属性只能存在于state中，data中的计算属性会在初始化时被计算一次，当作默认值，直接丢失计算属性特性
    get count() {
      // 这里直接用this.cats而非this.data.cats，是因为这里的this并非指向当前实例，而是指向数据，
      // 由于data和state最终会被合并，因此this其实是指向最终合并后的对象
      return this.cats.length
    },
  }

  // 表单模型，可以设置字段的默认值，类型，校验器等信息
  // 将合并data，优先级最高
  form = {}

  // 父级作用域传进来的props值
  // props会被赋值给data，并实现双向绑定，
  // props会被赋值给state，只被赋值一次
  // 不存在于data、state和form中的props会被本组件直接忽略
  // 但前提是，计算属性无法被赋值，因此，如果props中传入的属性包含data上的计算属性，也会无效
  inherit(observable) {
    return observable.map(props => props)
  }

  // 接收到子作用域传来的反写数据
  tribute(observable) {
    return observable.map(data => data)
  }

  // 数据进来的流，在controller中调用this.$set的时候被触发
  reactive(observable) {
    return observable.flatMap(data => data.id)
  }

  // 数据出去的流，无论是controller中的$set还是$emit，所有的事件交互对数据的修改都会合并为一个最终的结果，而这个最终的结果会经过pipe流到视图层
  consume(observable) {
    return observable.flatMap(data => data).switchMap(data => this.cats$.get().then(cats => {
      data.cats = cats
      return data
    }))
  }

}
