import { Component, Store } from 'nautil'
import { Section, Button, Navigate, Show } from 'nautil/components'
import { T } from 'nautil/i18n'

class Sub extends Component {
  static props = {
    $show: Boolean,
  }
  render() {
    const { show } = this.attrs
    return (
      <Section>
        <Show is={!show}>
          <Button onHint={() => this.attrs.show = true}>show</Button>
        </Show>
        <Show is={show}>
          <Button onHint={() => this.attrs.show = false}>hide</Button>
        </Show>
      </Section>
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
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
        </Section>

        <Section>
          <Sub $show={this.store} />
        </Section>
      </Section>
    )
  }
}

export default Page6
