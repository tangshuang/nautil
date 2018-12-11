import { Model, Ajax } from 'nautil'

export default class DefaultModel extends Model {

  cats$ = new Ajax({
    mode: 'switch',
    url: 'https://www.myserver.com/api/2.0/cats'
  })

  data() {
    return {
      id: '',
      text: '',
      cats: {},
    }
  }

  // 数据进来的流，在controller中调用this.$set的时候被触发
  reactive(observable) {
    return observable.flatMap(data => data.id)
  }

  // 数据出去的流，无论是controller中的$set还是$emit，所有的事件交互对数据的修改都会合并为一个最终的结果，而这个最终的结果会经过pipe流到视图层
  pipe(observable) {
    return observable.flatMap(data => data).switchMap(data => this.cats$.get().then(cats => {
      data.cats = cats
      return data
    }))
  }

}
