import { isObject, isString, mixin } from 'ts-fns'

import Static from '../../lib/components/static.jsx'
import { If } from '../../lib/components/if-else.jsx'

import ScrollSection from '../../lib/elements/scroll-section.jsx'

const { DOWN, UP, BOTH, NONE, ACTIVATE, DEACTIVATE, RELEASE, FINISH } = ScrollSection

mixin(ScrollSection, class {
  render() {
    // TODO
  }
})

export { ScrollSection }
export default ScrollSection
