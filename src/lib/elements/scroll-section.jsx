import { range, Any, enumerate } from 'tyshemo'

import Component from '../core/component.js'
import { noop } from '../core/utils.js'

export const DOWN = 'down'
export const UP = 'up'
export const BOTH = 'both'
export const NONE = 'none'
export const ACTIVATE = 'activate'
export const DEACTIVATE = 'deactivate'
export const RELEASE = 'release'
export const FINISH = 'finish'

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

    onRefresh: Function,
    onLoadMore: Function,
    onScroll: Function,

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
