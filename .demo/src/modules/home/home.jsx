import {
  Component,
  Section,
  Text,
} from 'nautil'
import Header from '../../components/header/header.jsx'
import NavBar from '../../components/nav-bar/nav-bar.jsx'

export class Home extends Component {
  renderFrom() {
    return [null, null,
      [Header],
      [NavBar],
      [Section, null,
        [Text, null, 'Home'],
      ],
    ]
  }
}
export default Home
