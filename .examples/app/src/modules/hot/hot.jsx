import {
  React,
  Component,
  Section,
  Text,
} from 'nautil'
import Header from '../../components/header/header.jsx'
import NavBar from '../../components/nav-bar/nav-bar.jsx'

export class Hot extends Component {
  render() {
    return (
      <>
        <Header />
        <NavBar />
        <Section>
          <Text>沸点</Text>
        </Section>
      </>
    )
  }
}
export default Hot
