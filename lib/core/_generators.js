import Component from './component.js'

export function createPollutedComponent(pollutions) {
  return class extends Component {
    onInit() {
      [].concat(pollutions).forEach(({ component, pollute, type }) => this.pollute(component, pollute, type))
    }

    onMount() {
      [].concat(pollutions).forEach(({ component, type }) => this.unpollute(component, type))
    }

    pollute(component, pollute, type) {
      const prop = '_' + type
      const appendedProps = isFunction(pollute) ? pollute(this.attrs) : pollute
      const name = component.name

      const originalPollutedProps = component[prop]
      const currentPollutedProps = originalPollutedProps || {}
      component[prop] = { ...currentPollutedProps, ...appendedProps }
      this[prop + 'Of' + name] = originalPollutedProps

      // if (type === 'pollutedProps') {
      //   const { defaultProps } = component
      //   const currentDefaultProps = defaultProps || {}
      //   component.defaultProps = { ...currentDefaultProps, ...appendedProps }
      //   this['_defaultPropsOf' + name] = defaultProps
      // }
    }

    unpollute(component, type) {
      const prop = '_' + type
      const name = component.name

      const originalPollutedProps = this[prop + 'Of' + name]
      component[prop] = originalPollutedProps
      delete this[prop + 'Of' + name]

      // if (type === 'pollutedProps') {
      //   const originalDefaultProps = this['_defaultPropsOf' + name]
      //   component.defaultProps = originalDefaultProps
      //   delete this['_defaultPropsOf' + name]
      // }
    }
  }
}
