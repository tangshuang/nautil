import React from 'react'
import {
  Component,
  Section,
  Text,
} from 'nautil'
import Header from '../../components/header/header.jsx'
import NavBar from '../../components/nav-bar/nav-bar.jsx'

export class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <NavBar />
        <Section>
          <Text>Home</Text>
        </Section>
      </>
    )
  }
}
export default Home
