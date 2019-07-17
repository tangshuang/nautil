import { Navigate, Section, Text } from 'nautil/components'
import { inject } from 'nautil/operators'
import navigation from '../navigation.js'

export function NotFound() {
  const Link = inject('navigation', navigation)(Navigate)
  return (
    <Section>
      <Text>Not found!</Text>
      <Link to="home">
        <Button>Home</Button>
      </Link>
    </Section>
  )
}
export default NotFound
