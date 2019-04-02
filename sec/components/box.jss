import { StyleSheet } from 'nautil/style-sheet'

// 创建样式表
// 样式表可以通过工具提炼出CSS文件，
// 也可以通过其他方式实现热更新
// 独立的样式作用域有一个好处，可以适应普通web网页，和基于shadow-dom的web组件
export const BoxStyle = new StyleSheet({
  // css属性遵循web标准
  display: 'block',

  myClass: new StyleSheet({
    color: 'red',
    textAlign: 'left',

    // 当一个属性值为StyleSheet实例时，被认为是一个子类
    // 子类将会自动继承父类的样式
    myChildrenClass: new StyleSheet({
      lineHeight: '12px',
    }),
  }),
})

// 扩展样式
export const SubBoxStyle = BoxStyle.extends({
  background: 'white',
})

// 提炼其中部分样式
export const LessBoxStyle = BoxStyle.extract({
  display: true,
})
