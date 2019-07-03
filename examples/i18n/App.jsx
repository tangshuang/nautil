import { Component, Observer, Provider } from 'nautil'
import I18n from 'nautil/i18n'
import Page1 from './pages/Page1.jsx'

// https://www.i18next.com/overview/configuration-options
const i18n = new I18n(options)

export class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => i18n.on('onLoaded', dispatch).on('onLanguageChanged', dispatch)}>
        <Provider $i18n={i18n}>
          <Page1 />
        </Provider>
      </Observer>
    )
  }
}