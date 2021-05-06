import React from 'react'
import { mixin } from 'ts-fns'
import { SectionList, Dimensions } from 'react-native'

import ScrollSection, {
  DOWN,
  UP,
  BOTH,
  NONE,
  ACTIVATE,
  DEACTIVATE,
  RELEASE,
  FINISH,
} from '../../lib/elements/scroll-section.jsx'

mixin(ScrollSection, class {
  init() {
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
            this.dispatch('Refresh')
          }
          else if ([UP, BOTH].includes(direction) && directTo === UP) {
            this.dispatch('LoadMore')
          }
        }}
        refreshing={doing}
        ListFooterComponent={loadMoreIndicator[status]}
        ListHeaderComponent={refreshIndicator[status]}
      />
    )
  }
})

export { ScrollSection }
export default ScrollSection
