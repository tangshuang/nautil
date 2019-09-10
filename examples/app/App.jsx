import { Component } from 'nautil'
import { Section, Navigator } from 'nautil/components'
import { Language } from 'nautil/i18n'

import styles from './App.css'

import navigation from './navigation.js'
import i18n from './i18n.js'

class App extends Component {
  render() {
    return (
      <Section stylesheet={styles.app}>
        <Section stylesheet={styles.container}>
          <Language i18n={i18n} dispatch={this.update}>
            <Navigator navigation={navigation} />
          </Language>
        </Section>
      </Section>
    )
  }
}

export default App
