import { Component, Navigator, Provider, ObservableProvider } from 'nautil'
import { Section } from 'nautil/components'

import styles from './App.css'

import navigation from './navigation.js'
import { depoContext } from './depo.js'
import { store, storeContext } from './store.js'


class App extends Component {
  render() {
    return (
      <Section stylesheet={styles.app}>
        <Section stylesheet={styles.container}>
          <ObservableProvider context={storeContext}
            subscribe={dispatch => store.watch('*', dispatch)} dispatch={this.update}
          >
            <Provider context={depoContext}>
              <Navigator navigation={navigation}></Navigator>
            </Provider>
          </ObservableProvider>
        </Section>
      </Section>
    )
  }
}

export default App
