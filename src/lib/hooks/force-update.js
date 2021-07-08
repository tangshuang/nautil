import { useState } from 'react'

export function useForceUpdate() {
  const [_, setState] = useState()
  return () => setState({})
}
export default useForceUpdate