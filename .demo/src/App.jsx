import React, { useState, createContext } from 'react'
import { Component, connect, provide } from '../../index'
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
        <div>
          <Child />
        </div>
      </div>
    )
  }
}

const context = createContext(null)

const Child = connect('name', context)(function Child(props) {
  const { name: [name, setName] } = props
  return <span onClick={() => setName('xisa')}>child: {name}</span>
})

const Container = provide('child', context)(function Container() {
  // use as two-way-binding
  const $age = useState(10)
  return (
    <div className='container'>
      <Some name='tomy' $age={$age} onClick={console.log.bind(console)} stylesheet={[{ name: true, color: 'red' }, 'some-class']} />
    </div>
  )
})

export default function App() {
  const child = useState('ximi')
  return <Container child={child} />
}
