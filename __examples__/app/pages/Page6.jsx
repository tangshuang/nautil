import { Component, Store } from 'nautil'
import { Section, Button, Navigate, Show } from 'nautil/components'
import { T } from 'nautil/i18n'

class Sub extends Component {
  static props = {
    show: Boolean,
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
  onInit() {
    this.store = new Store({
      show: false,
    })
    this.store.watch('show',this.update)
  }
  render() {
    const { state } = this.store
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
        </Section>

        <Section>
          <Button onHint={() => state.show = true}>show</Button>
          <Sub $show={[state.show, show => state.show = show]} />
        </Section>
      </Section>
    )
  }
}

export default Page6
