import React from 'react'
import {
  Component,
  Section,
  Text,
} from 'nautil'
import { Header } from '../../components/header/header.jsx'

export class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <Section>
          <Text>Home</Text>
        </Section>
      </>
    )
  }
}
export default Home
