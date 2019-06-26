import { React, Component } from 'nautil'

export class Page1 extends Component {
  change() {
    // change the sepcial prop directly, which will trigger rerender
    this.$state.age = parseInt(Math.random() * 100, 10)
  }
  render() {
    const state = this.$state
    return (
      <div>
        <p><span>name: {state.name}</span></p>
        <p><span>age: {state.age}</span></p>
        <p><button onClick={() => this.change()}>change</button></p>
      </div>
    )
  }
}

export default Page1
