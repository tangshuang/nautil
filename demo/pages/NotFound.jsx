import { Section, Text } from 'nautil/components'

export function NotFound() {
  return (
    <Section>
      <Text>Not found!</Text>
      <Navigate to="home">
        <Button>Home</Button>
      </Navigate>
    </Section>
  )
}
export default NotFound
