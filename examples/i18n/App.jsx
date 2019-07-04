import { Component, ObservableProvider } from 'nautil'
import I18n from 'nautil/i18n'
import Page1 from './pages/Page1.jsx'

// https://www.i18next.com/overview/configuration-options
const i18n = new I18n(options)

export class App extends Component {
  render() {
    return (
      <ObservableProvider
        name="$i18n" value={i18n}
        subscribe={dispatch => i18n.on('onLoaded', dispatch).on('onLanguageChanged', dispatch)}
        dispatch={this.update}
      >
        <Page1 />
      </ObservableProvider>
    )
  }
}
