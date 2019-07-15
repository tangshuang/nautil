/**
 * 1. use Consumer to receive Provider providings
 * 2. update with store.state.age++
 * 3. depo.request vs. depo.get
 * 4. navigation.go
 */

import { Component } from 'nautil'
import { Navigate, Consumer, Section, Button, Text } from 'nautil/components'
import { storeContext, depoContext } from '../contexts.js'

class Page1 extends Component {
  render() {
    return (
      <Consumer context={Navigate.Context}>
        {$navigation => <Consumer context={storeContext}>
          {$store => <Consumer context={depoContext}>
              {$depo => {
                const { name, age, info } = $store.state
                const grow = () => {
                  $store.state.age ++
                }
                return (
                  <Section>
                    <Section>
                      <Navigate to="home">
                        <Button>Home</Button>
                      </Navigate>
                      <Button onHint={() => $navigation.go('page2', { id: '123', action: 'edit' })}>Page2</Button>
                    </Section>
                    <Section>
                      <Section><Text>name: {name}</Text></Section>
                      <Section><Text>age: {age}</Text></Section>
                      <Section><Text>time: {info.time}</Text></Section>
                    </Section>
                    <Section>
                      <Button onHint={() => grow()}>grow</Button>
                      <Button onHint={() => $depo.request('info')}>request</Button>
                      <Button onHint={() => $depo.get('info')}>get</Button>
                    </Section>
                  </Section>
                )
              }}
            </Consumer>}
        </Consumer>}
      </Consumer>
    )
  }
}

export default Page1
