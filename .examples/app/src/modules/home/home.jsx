import {
  React,
  Component,
  Section,
  Text,
} from 'nautil'
import Header from '../../components/header/header.jsx'
import NavBar from '../../components/nav-bar/nav-bar.jsx'
import { HomeController } from './home.controller.js'

export class Home extends Component {
  controller = new HomeController()

  HomeCover = this.controller.turn(() => {
    const items = this.controller.articles
    return (
      <Section>
        <Text>Home</Text>
        {JSON.stringify(items)}
      </Section>
    )
  })

  render() {
    const { HomeCover } = this
    return (
      <>
        <Header />
        <NavBar />
        <HomeCover />
      </>
    )
  }
}
export default Home
