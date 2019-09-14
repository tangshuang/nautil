import { Component } from '../core/component.js'
import { SectionList, Dimensions } from 'react-native'

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

export class MPullToLoad extends Component {
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

    containerStyle: Object,
    contentStyle: Object,
    refreshIndicatorStyle: Object,
    loadMoreIndicatorStyle: Object,
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

    containerStyle: {},
    contentStyle: {},
    refreshIndicatorStyle: {},
    loadMoreIndicatorStyle: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      status: DEACTIVATE,
    }

    this.reset()
  }

  reset() {
    this._startY = 0
    this._latestY = 0
  }

  onUpdated(prevProps) {
    const { refreshing, loading } = this.attrs
    if (prevProps.refreshing && !refreshing) {
      this.setState({ status: FINISH })
      this.reset()
    }
    if (prevProps.loading && !loading) {
      this.setState({ status: FINISH })
      this.reset()
    }
  }

  render() {
    const { refreshing, loading, distance, direction, refreshIndicator, loadMoreIndicator } = this.attrs
    const { status } = this.state
    const { height } = Dimensions.get('window')

    const { _startY, _latestY } = this
    const directTo = _startY < _latestY ? DOWN : _startY > _latestY ? UP : NONE
    const threshold = direction === NONE ? 0 : distance/height
    const doing = directTo === DOWN ? refreshing : directTo === UP ? loading : false

    return (
      <SectionList
        renderItem={(children) => children}
        sections={[this.children]}
        onScroll={(e) => {
          if (direction === NONE) {
            return
          }
          const { nativeEvent } = e
          const { contentOffset } = nativeEvent
          const { y } = contentOffset
          this._startY = this._startY || y
          this._latestY = y
        }}
        onScrollBeginDrag={() => this.setState({ status: DEACTIVATE })}
        onScrollEndDrag={() => this.setState({ status: DEACTIVATE })}
        onEndReachedThreshold={threshold}
        onEndReached={() => {
          if (direction === NONE) {
            return
          }
          this.setState({ status: ACTIVATE })
        }}
        onRefresh={() => {
          if (direction === NONE) {
            return
          }
          this.setState({ status: RELEASE })
          if ([DOWN, BOTH].includes(direction) && directTo === DOWN) {
            this.onRefresh$.next()
          }
          else if ([UP, BOTH].includes(direction) && directTo === UP) {
            this.onLoadMore$.next()
          }
        }}
        refreshing={doing}
        ListFooterComponent={loadMoreIndicator[status]}
        ListHeaderComponent={refreshIndicator[status]}
      />
    )
  }
}

export default MPullToLoad
