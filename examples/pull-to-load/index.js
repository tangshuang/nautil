import { mount } from 'nautil/mobile-dom'
import { Component } from 'nautil'
import { Section, Text, ScrollSection } from 'nautil/mobile-components'

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
  state = {
    refreshing: false,
    loading: false,
  }
  render() {
    return (
      <Section stylesheet={styles.section}>
        <ScrollSection
          direction="both"
          loading={this.state.loading}
          onLoadMore={() => {
            console.log('loading')
            this.setState({ loading: true })
            setTimeout(() => this.setState({ loading: false }), 2000)
          }}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            console.log('refreshing')
            this.setState({ refreshing: true })
            setTimeout(() => this.setState({ refreshing: false }), 2000)
          }}
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
        </ScrollSection>
      </Section>
    )
  }
}

mount('#app', App)
