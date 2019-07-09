import { each, isFunction, isString, isArray } from '../core/utils.js'
import { Consumer } from '../core-components/provider.jsx'

export function connect(givenProviders = {}, mergeAndMapProps) {
  const pipe = []

  if (isArray(givenProviders)) {
    const given = {}
    givenProviders.forEach((key) => {
      given[key] = true
    })
    givenProviders = given
  }

  each(givenProviders, (value, name) => {
    if (isString(value) && !value) {
      return
    }

    const generate = (children) => <Consumer name={name}>{children}</Consumer>
    pipe.push({
      name: isString(value) ? value : name,
      generate,
    })
  })

  const consume = (fn, props) => pipe.reduce((fn, { name, generate }) => () => generate((value) => {
    props[name] = value
    return fn()
  }), fn)

  return function(Component) {
    return function(props = {}) {
      const provideProps = {}
      const fn = () => {
        const attrs = isFunction(mergeAndMapProps) ? mergeAndMapProps(provideProps, props) : { ...provideProps, ...props }
        return <Component {...attrs}></Component>
      }
      return consume(fn, provideProps)()
    }
  }
}

export default connect
