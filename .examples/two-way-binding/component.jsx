import { React, Component, Button, Section } from 'nautil'

export default class Toggler extends Component {
  static props = {
    $show: Boolean,
  }
  render() {
    return (
      <>
        {this.attrs.show ? <Section>{this.children}</Section> : null}
        <Button onHit={() => this.attrs.show = !this.attrs.show}>toggle</Button>
      </>
    )
  }
}
