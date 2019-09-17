import { Component, Store } from 'nautil'
import { Section, Button, Navigate, Show } from 'nautil/components'
import { T } from 'nautil/i18n'
import { Binding } from 'nautil/types'
import { observe, pipe, inject } from 'nautil/operators'

class Sub extends Component {
  static props = {
    $show: Binding,
  }
  render() {
    const { show } = this.attrs
    return (
      <Show is={show}>
        <Button onHint={() => this.attrs.show = false}>hide</Button>
      </Show>
    )
  }
}

export class Page6 extends Component {
  render() {
    const { state } = this.attrs
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
        </Section>

        <Section>
          <Button onHint={() => state.show = true}>show</Button>
          <Sub $show={state} />
        </Section>
      </Section>
    )
  }
}

const store = new Store({
  show: false,
})

export default pipe([
  observe(store),
  inject('state', store.state)
])(Page6)
