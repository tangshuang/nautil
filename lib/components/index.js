/**
 * Use webpack to resolve.alias
 * ../components/ => RUNTIME_ENV === 'native' ? ../native-components/ : ../dom-compoments/
 * So that it can support tree-shaking
 */

// global components
export * from '../components/section.jsx'
export * from '../components/text.jsx'
export * from '../components/image.jsx'
export * from '../components/line.jsx'
export * from '../components/button.jsx'

export * from '../components/input.jsx'
export * from '../components/textarea.jsx'
export * from '../components/checkbox.jsx'
export * from '../components/radio.jsx'
export * from '../components/select.jsx'

export * from '../components/audio.jsx'
export * from '../components/video.jsx'
export * from '../components/webview.jsx'

// mobile components
export * from '../components/scroll-section.jsx'
export * from '../components/swipe-section.jsx'
export * from '../components/list-section.jsx'
