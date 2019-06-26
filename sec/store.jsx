import { Store, Component, Observer, Section, Text, Button, Provider } from 'nautil'

const store = new Store({
  name: 'tomy',
  age: 10,
})

export class Some extends Component {
  render() {
    return <Section>
      <Text>{store.state.name}</Text>
      <Text>{store.state.age}</Text>
    </Section>
  }
}

export class App extends Component {
  render() {
    // use Observer to rerender view
    // use Provider to inject $store for all children components
    return (
      <Observer subscribe={dispatch => store.watch('*', dispatch)}>
        <Provider $store={store}>
          <Some />
          <Section>
            <Button onHintStart={() => store.set('name', 'lily')}>change</Button>
          </Section>
        </Provider>
      </Observer>
    )
  }
}
