import { Navigate, Section, Text, Button } from 'nautil/components'
import { T } from 'nautil/i18n'

export function NotFound() {
  return (
    <Section>
      <Text><T>notFound</T></Text>
      <Navigate to="home">
        <Button><T>home</T></Button>
      </Navigate>
    </Section>
  )
}
export default NotFound
