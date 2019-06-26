import { React, Component } from 'nautil'

export class Page1 extends Component {
  render() {
    const state = this.$state
    return (
      <div>
        <p><span>name: {state.name}</span></p>
        <p><span>age: {state.age}</span></p>
        <p><button onClick={() => { state.age = parseInt(Math.random() * 100, 10) }}>change</button></p>
      </div>
    )
  }
}

export default Page1
