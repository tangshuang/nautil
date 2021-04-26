import {
  React,
  Component,
  Section,
  Text,
  Controller,
  DataService,
} from 'nautil'
import Header from '../../components/header/header.jsx'
import NavBar from '../../components/nav-bar/nav-bar.jsx'

class HomeDataService extends DataService {
  items = this.source(() => [
    { name: '1' },
    { name: '2' },
  ], [])
}

class HomeController extends Controller {
  static dataService = HomeDataService

  HomeCover() {
    const [items] = this.dataService.query(this.dataService.items)
    return (
      <Section>
        <Text>Home</Text>
        {JSON.stringify(items)}
      </Section>
    )
  }
}

export class Home extends Component {
  controller = new HomeController()

  render() {
    const { HomeCover } = this.controller
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
