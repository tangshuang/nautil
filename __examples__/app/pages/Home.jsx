import { Navigate, Section, Text, Button } from 'nautil/components'
import { T, Locale } from 'nautil/i18n'

export function Home() {
  return (
    <Section>
      <Section>
        <Text><T>welcome</T></Text>
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
        <Navigate to="page6">
          <Button>Page6</Button>
        </Navigate>
        <Navigate to="page7">
          <Button>Page7</Button>
        </Navigate>
      </Section>
      <Section>
        <Locale to="en-US"><Button>en-US</Button></Locale>
        <Locale to="zh-CN"><Button>zh-CN</Button></Locale>
      </Section>
    </Section>
  )
}
export default Home
