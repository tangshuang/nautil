import { mount } from 'nautil/dom'
import { Component } from 'nautil'
import { Section, Text } from 'nautil/components'
import MPullToLoad from 'nautil/lib/dom/m-pull-to-load.jsx'

const styles = {
  section: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
  },
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
  },
}

class App extends Component {
  render() {
    return (
      <Section stylesheet={styles.section}>
        <MPullToLoad
          containerStyle={styles.container}
          contentStyle={styles.content}
        >
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
          <Section><Text>xxxxxxx</Text></Section>
        </MPullToLoad>
      </Section>
    )
  }
}

mount('#app', App)
