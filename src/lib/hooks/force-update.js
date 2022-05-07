import { useState } from 'react'

export function useForceUpdate() {
  const [, setState] = useState({})
  return () => setState({})
}
export default useForceUpdate
