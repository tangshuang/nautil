import { mixin } from 'ts-fns'
import { ScrollSection } from '../../lib/elements/scroll-section.jsx'

const { DOWN, UP, BOTH, NONE, ACTIVATE, DEACTIVATE, RELEASE, FINISH } = ScrollSection

mixin(ScrollSection, class {
  render() {
    // TODO
  }
})

export { ScrollSection }
export default ScrollSection
