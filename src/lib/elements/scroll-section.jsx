import { range, Any, enumerate } from 'tyshemo'

import Component from '../component.js'

const DOWN = 'down'
const UP = 'up'
const BOTH = 'both'
const NONE = 'none'
const ACTIVATE = 'activate'
const DEACTIVATE = 'deactivate'
const RELEASE = 'release'
const FINISH = 'finish'

export class ScrollSection extends Component {
  static props = {
    direction: enumerate([UP, DOWN, BOTH, NONE]),
    distance: Number,
    damping: range({ min: 0, max: 1 }),

    topLoading: Boolean,
    topIndicator: {
      [ACTIVATE]: Any,
      [DEACTIVATE]: Any,
      [RELEASE]: Any,
      [FINISH]: Any,
    },
    topIndicatorStyle: enumerate([Object, String]),
    onTopRelease: false,

    bottomLoading: Boolean,
    bottomIndicator: {
      [ACTIVATE]: Any,
      [DEACTIVATE]: Any,
      [RELEASE]: Any,
      [FINISH]: Any,
    },
    bottomIndicatorStyle: enumerate([Object, String]),
    onBottomRelease: false,

    onScroll: false,

    containerStyle: enumerate([Object, String]),
    contentStyle: enumerate([Object, String]),
  }

  static defaultProps = {
    direction: NONE,
    distance: 40,
    damping: 0.4,

    topLoading: false,
    topIndicator: {
      [ACTIVATE]: 'release',
      [DEACTIVATE]: 'pull',
      [RELEASE]: 'refreshing',
      [FINISH]: 'finish',
    },
    topIndicatorStyle: {},

    bottomLoading: false,
    bottomIndicator: {
      [ACTIVATE]: 'release',
      [DEACTIVATE]: 'pull',
      [RELEASE]: 'loading',
      [FINISH]: 'finish',
    },
    bottomIndicatorStyle: {},

    containerStyle: {},
    contentStyle: {},
  }
}

ScrollSection.UP = UP
ScrollSection.DOWN = DOWN
ScrollSection.BOTH = BOTH
ScrollSection.NONE = NONE
ScrollSection.ACTIVATE = ACTIVATE
ScrollSection.DEACTIVATE = DEACTIVATE
ScrollSection.RELEASE = RELEASE
ScrollSection.FINISH = FINISH

export default ScrollSection
