import { If, useState, useEffect, useRef } from 'nautil'

export default function App() {
  const [bool, setBool] = useState(false)
  const data = useRef({})

  useEffect(() => {
    setTimeout(() => {
      data.current = {
        body: {
          content: 'text',
        },
      }
      setBool(true)
    }, 3000)
  }, [])

  return (
    <If is={bool}>
      {/* Content will not render when bool is not true */}
      <Content data={data.current} />
    </If>
  )
}

function Content(props) {
  console.log('hint--->')
  return props.data.body.content
}
