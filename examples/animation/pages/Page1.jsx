import { Component } from 'nautil'
import { Text } from 'nautil/components'
import { Animation } from 'nautil/animation'

export class Page1 extends Component {
  render() {
    return (
      <Animation enter="fade:in moveto:left-top" leave="fade:out moveto:right-bottom" show={this.attrs.show}>
        <Text>This is an Animation demo.</Text>
      </Animation>
    )
  }
}
