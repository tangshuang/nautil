import { Navigate, Section, Text, Button } from 'nautil/components'

export function Home() {
  return (
    <Section>
      <Section>
        <Text>Welcome to Nautil's world! 😊</Text>
      </Section>
      <Section>
        <Navigate to="page1">
          <Button>Page1</Button>
        </Navigate>
        <Navigate to="page2" params={{ id: '123' }}>
          <Button>Page2</Button>
        </Navigate>
        <Navigate to="page3">
          <Button>Page3</Button>
        </Navigate>
        <Navigate to="page4">
          <Button>Page4</Button>
        </Navigate>
        <Navigate to="page5">
          <Button>Page5</Button>
        </Navigate>
      </Section>
    </Section>
  )
}
export default Home
