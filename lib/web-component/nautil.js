import { mount, unmount } from '../dom/nautil.js'
import retargetEvents from './retarget-events.js'

export function define(name, Component, cssText) {
  // https://hackernoon.com/how-to-turn-react-component-into-native-web-component-84834315cb24
  class NautilCustomElement extends HTMLElement {
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.observer = new MutationObserver(() => this.update())
      this.observer.observe(this, { attributes: true })
    }
    connectedCallback() {
      this._initStyleSheets()
      this._initContainer()
      this.mount()
      this._unBindEvents = retargetEvents(this.shadowRoot)
    }
    disconnectedCallback(){
      this.unmount()
      this._unBindEvents()
      this.observer.disconnect()
    }

    update() {
      this.unmount()
      this.mount()
    }
    mount() {
      const { props : PropsTypes = {}, propTypes = {} } = Component
      const types = { ...propTypes, ...PropsTypes }
      const props = {
        ...this._getProps(this.attributes, types),
        ...this._getEvents(types),
      }
      mount(this.container, Component, props)
    }
    unmount() {
      unmount(this.container)
    }

    _initContainer() {
      const container = document.createElement('div')
      this.container = container
      this.shadowRoot.appendChild(container)
    }
    _initStyleSheets() {
      if (!cssText) {
        return
      }

      const style = document.createElement('style')
      style.type = 'text/css'
      if (style.styleSheet) {
        style.styleSheet.cssText = cssText
      }
      else {
        style.appendChild(document.createTextNode(cssText))
      }

      this.shadowRoot.appendChild(style)
    }

    _getEvents(propTypes) {
      return Object.keys(propTypes).filter(key => /on([A-Z].*)/.exec(key))
        .reduce((events, ev) => ({
          ...events,
          // ev.substr(2).replace(/^[A-Z]/, letter => letter.toLowerCase())
          [ev]: args => this.dispatchEvent(new CustomEvent(ev, args)),
        }), {})
   }
    _getProps(attributes, propTypes = {}) {
      return [ ...attributes ].filter(attr => attr.name !== 'style')
         .map(attr => this._convertProp(attr.name, attr.value, propTypes))
         .reduce((props, prop) => ({ ...props, [prop.name]: prop.value }), {})
   }
   _convertProp(attrName, attrValue, propTypes) {
      const propName = Object.keys(propTypes).find(key => key.toLowerCase() == attrName)
      let value = attrValue
      if (attrValue === 'true' || attrValue === 'false') {
        value = attrValue === 'true'
      }
      else if (!isNaN(attrValue) && attrValue !== '') {
        value = +attrValue
      }
      else if (/^{.*}/.exec(attrValue)) {
        value = JSON.parse(attrValue)
      }
      return {
         name: propName ? propName : attrName,
         value,
      }
    }
  }
  window.customElements.define(name, NautilCustomElement)
}
