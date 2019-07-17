import { Component, Navigator } from 'nautil'
import { Section } from 'nautil/components'

import styles from './App.css'

import navigation from './navigation.js'

class App extends Component {
  render() {
    return (
      <Section stylesheet={styles.app}>
        <Section stylesheet={styles.container}>
          <Navigator navigation={navigation} />
        </Section>
      </Section>
    )
  }
}

export default App
