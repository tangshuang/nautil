import { Navigate, Section, Text, Button } from 'nautil/components'
import { inject } from 'nautil/operators'
import navigation from '../navigation.js'

export function Home() {
  const Link = inject('navigation', navigation)(Navigate)
  return (
    <Section>
      <Section>
        <Text>Welcome to Nautil's world! 😊</Text>
      </Section>
      <Section>
        <Link to="page1">
          <Button>Page1</Button>
        </Link>
        <Link to="page2" params={{ id: '123' }}>
          <Button>Page2</Button>
        </Link>
        <Link to="page3">
          <Button>Page3</Button>
        </Link>
        <Link to="page4">
          <Button>Page4</Button>
        </Link>
      </Section>
    </Section>
  )
}
export default Home
