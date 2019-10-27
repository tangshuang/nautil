/**
 * Use webpack to resolve.alias
 * 'nautil/lib/components': RUNTIME_ENV === 'native' ? 'nautil/lib/native-components' : 'nautil/lib/dom-components'
 * So that it can support tree-shaking
 */

// global components
export * from 'nautil/lib/components/section.jsx'
export * from 'nautil/lib/components/text.jsx'
export * from 'nautil/lib/components/image.jsx'
export * from 'nautil/lib/components/line.jsx'
export * from 'nautil/lib/components/button.jsx'

export * from 'nautil/lib/components/input.jsx'
export * from 'nautil/lib/components/textarea.jsx'
export * from 'nautil/lib/components/checkbox.jsx'
export * from 'nautil/lib/components/radio.jsx'
export * from 'nautil/lib/components/select.jsx'

export * from 'nautil/lib/components/audio.jsx'
export * from 'nautil/lib/components/video.jsx'
export * from 'nautil/lib/components/webview.jsx'

// mobile components
export * from 'nautil/lib/components/scroll-section.jsx'
export * from 'nautil/lib/components/swipe-section.jsx'
export * from 'nautil/lib/components/list-section.jsx'
