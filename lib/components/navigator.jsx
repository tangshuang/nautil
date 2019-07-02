import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import Provider from './provider.jsx'

export class Navigator extends Component {
  static validateProps = {
    navigation: Navigation,
  }

  render() {
    const { navigation } = this.attrs
    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)}>
        <Provider $navigation={navigation}>
          {this.children}
        </Provider>
      </Observer>
    )
  }
}
export default Navigator
