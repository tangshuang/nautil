import React, { useState } from 'react'
import Component from '../../src/core/component'
import { map } from 'rxjs/operators'

class Some extends Component {
  // define a static property called props
  static props = {
    // normal prop
    name: String,
    // two-way-binding prop
    $age: Number,
    // event stream
    onClick: true,

    // set by defaultProps
    some: String,
  }

  static defaultProps = {
    some: 'some by default',
  }

  onInit() {
    this.bind('Click', stream => stream.pipe(
      map(v => v + '[Modified]')
    ))
  }

  grow = () => {
    // update two-way-binding prop
    this.attrs.age ++
    // emit event
    this.emit('Click', 'You have clicked the button.')
  }

  render() {
    const { name, age, some } = this.attrs
    return (
      <div>
        <div>
          <span>{name}: {age}</span>
          <button onClick={this.grow}>grow</button>
        </div>
        <div className={this.className} style={this.style}>
          {some}
        </div>
      </div>
    )
  }
}

export default function App() {
  // use as two-way-binding
  const $age = useState(10)
  return (
    <div className='App'>
      <h4></h4>
      <Some name='tomy' $age={$age} onClick={console.log.bind(console)} stylesheet={[{ name: true, color: 'red' }, 'some-class']} />
    </div>
  )
}
