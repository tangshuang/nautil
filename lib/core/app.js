import Component from './component.js'
import { Navigator } from './navigator.jsx'
import { ObservableProvider } from './provider.jsx'
import Prepare from './prepare.jsx'
import { If, ElseIf } from './if-else.jsx'
import React from 'react'
import { PROVIDER_RECORDS } from './_shared.js'
import { hesitantComponent } from './utils.js'

/**
 * const app = new App({
 *   navigation: // required
 *     > routes:
 *       > name
 *       > path
 *       > component // required
 *     > notFound
 *   i18n
 *   store
 *   depository
 *
 *   isReady
 *   loading
 * })
 */
export class App {
  constructor(options = {}) {
    this.options = options
    this._running = false
  }
  create() {
    if (this._running) {
      return
    }

    const {
      navigation,
      store,
      depository,
      i18n,
      isReady = () => true,
      loading,
    } = this.options
    this.navigation = navigation
    this.store = store
    this.depository = depository
    this.i18n = i18n

    const $this = this

    class App extends Component {
      render() {
        return (
          <Navigator navigation={navigation} dispatch={this.update}>
            {hesitantComponent(
              store,
              ObservableProvider,
              {
                name: '$store',
                value: store,
                subscribe: dispatch => store.watch('*', dispatch),
                dispatch: this.update,
              },
              hesitantComponent(
                depository,
                ObservableProvider,
                {
                  name: '$depo',
                  value: depository,
                  subscribe: dispatch => depository.subscribe('*', dispatch),
                  dispatch: this.update,
                },
                hesitantComponent(
                  i18n,
                  ObservableProvider,
                  {
                    name: '$i18n',
                    value: i18n,
                    subscribe: dispatch => i18n.on('onLoaded', dispatch).on('onLanguageChanged', dispatch),
                    dispatch: this.update,
                  },
                  <Prepare isReady={navigation.status !== '' && isReady.call($this)} loadingComponent={loading}>
                    <If condition={navigation.status !== '' && navigation.status !== '!'}>
                      <navigation.state.route.component {...navigation.state.params} />
                    <ElseIf condition={navigation.status === '!'} />
                      <navigation.options.notFound />
                    </If>
                  </Prepare>
                ),
              ),
            )}
          </Navigator>
        )
      }
    }

    return App
  }
  config(configs = {}) {
    if (this._running) {
      return this
    }

    this.options = { ...this.options, ...configs }
    return this
  }
  provide(name, value) {
    if (PROVIDER_RECORDS[name]) {
      throw new Error(`Provider '${name}' has been registered.`)
    }

    const context = React.createContext(value)
    PROVIDER_RECORDS[name] = {
      context,
      value,
    }

    return this
  }
  start() {
    throw new Error('start method should be override.')
  }
  stop() {
    throw new Error('stop method should be override.')
  }
}

export default App
