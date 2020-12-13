import React from 'react'
import {
  Component,
  Section,
  Text,
} from 'nautil'
import { Header } from '../../components/header/header.jsx'

export class Hot extends Component {
  render() {
    return (
      <>
        <Header />
        <Section>
          <Text>沸点</Text>
        </Section>
      </>
    )
  }
}
export default Hot
