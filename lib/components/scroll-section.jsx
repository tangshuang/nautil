import Component from '../core/component.js'
import { range, Any, enumerate } from '../types.js'
import { noop } from '../utils.js'

const DOWN = 'down'
const UP = 'up'
const BOTH = 'both'
const NONE = 'none'
const ACTIVATE = 'activate'
const DEACTIVATE = 'deactivate'
const RELEASE = 'release'
const FINISH = 'finish'
const LOAD_MORE_INDICATOR = {
  [ACTIVATE]: 'release',
  [DEACTIVATE]: 'pull',
  [RELEASE]: 'loading',
  [FINISH]: 'finish',
}
const REFRESH_INDICATOR = {
  [ACTIVATE]: 'release',
  [DEACTIVATE]: 'pull',
  [RELEASE]: 'refreshing',
  [FINISH]: 'finish',
}

export class ScrollSection extends Component {
  static props = {
    direction: enumerate([UP, DOWN, BOTH, NONE]),
    distance: Number,
    damping: range({ min: 0, max: 1 }),

    refreshIndicator: {
      [ACTIVATE]: Any,
      [DEACTIVATE]: Any,
      [RELEASE]: Any,
      [FINISH]: Any,
    },
    loadMoreIndicator: {
      [ACTIVATE]: Any,
      [DEACTIVATE]: Any,
      [RELEASE]: Any,
      [FINISH]: Any,
    },

    refreshing: Boolean,
    loading: Boolean,

    containerStyle: enumerate([Object, String]),
    contentStyle: enumerate([Object, String]),
    refreshIndicatorStyle: enumerate([Object, String]),
    loadMoreIndicatorStyle: enumerate([Object, String]),
  }

  static defaultProps = {
    direction: NONE,
    distance: 40,
    damping: 0.4,

    refreshIndicator: REFRESH_INDICATOR,
    loadMoreIndicator: LOAD_MORE_INDICATOR,

    refreshing: false,
    loading: false,

    onRefresh: noop,
    onLoadMore: noop,
    onScroll: noop,

    containerStyle: {},
    contentStyle: {},
    refreshIndicatorStyle: {},
    loadMoreIndicatorStyle: {},
  }
}
export default ScrollSection
