// https://github.com/react-component/m-pull-to-refresh
// pull to refresh/load-more on mobile

import { Component } from '../core/component.js'
import Static from '../core-components/static.jsx'
import If from '../core-components/if-else.jsx'
import { range, Any, enumerate } from '../core/types.js'
import { noop } from '../core/utils.js'

const IS_WEBVIEW = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
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

    this.containerRef = null
    this.wrapperRef = null
    this.contentRef = null

    this._currentY = 0
    this._startY = 0
    this._latestY = 0

    this._timer = null
    this._inited = false

    this.shouldUpdateChildren = false

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  shouldUpdate(nextProps) {
    this.shouldUpdateChildren = this.props.children !== nextProps.children
    return true
  }

  onMounted() {
    this._timer = setTimeout(() => {
      this.init()
      this.trigger()
    })
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

  onUnmount() {
    clearTimeout(this._timer)
    this.destroy()
  }

  init() {
    if (this._inited) {
      return
    }

    const { containerRef } = this
    if (!containerRef) {
      // like return in destroy fn ???!!
      return
    }

    containerRef.addEventListener('touchstart', this.onTouchStart, { passive: false })
    containerRef.addEventListener('touchmove', this.onTouchMove, { passive: false })
    containerRef.addEventListener('touchend', this.onTouchEnd, { passive: false })

    this._inited = true
  }

  destroy() {
    if (!this._inited) {
      return
    }

    containerRef.removeEventListener('touchstart', this.onTouchStart)
    containerRef.removeEventListener('touchmove', this.onTouchMove)
    containerRef.removeEventListener('touchend', this.onTouchEnd)
  }

  trigger() {
    if (!this._inited) {
      return
    }

    const { refreshing, loading, direction, distance } = this.attrs

    if (refreshing && [DOWN, BOTH].includes(direction)) {
      this.setState({ status: RELEASE })
      this._latestY = - distance - 1
      this.setContentY(this._latestY)
      this.onRefresh$.next()
    }
    else if (loading && [UP, BOTH].includes(direction)) {
      this.setState({ status: RELEASE })
      this._latestY = distance + 1
      this.setContentY(this._latestY)
      this.onLoadMore$.next()
    }
  }

  onTouchStart(e) {
    const { direction } = this.attrs

    if (direction === NONE) {
      return
    }

    const currentY = e.changedTouches[0].clientY
    this._currentY = currentY
    this._startY = currentY
    // when refreshing is true, this._latestY has value
    this._latestY = this._latestY || 0
  }

  // only affect when move to the edge, and to translateY to show hidden indicator
  onTouchMove(e) {
    const { direction, distance } = this.attrs

    if (direction === NONE) {
      return
    }

    const currentY = e.changedTouches[0].clientY
    const startY = this._startY
    const directTo = startY < currentY ? DOWN : startY > currentY ? UP : NONE

    if (direction === UP && directTo !== UP) {
      return
    }
    if (direction === DOWN && directTo !== DOWN) {
      return
    }

    // when not touch the edge, do not translate
    if (!this.isEdge(directTo)) {
      return
    }

    // e.preventDefault()
    // add stopPropagation with fastclick will trigger content onClick event. why?
    // ref https://github.com/ant-design/ant-design-mobile/issues/2141
    // e.stopPropagation()

    const { status } = this.state
    const prevMoveAtY = this._currentY
    const diff = Math.round(currentY - prevMoveAtY)
    this._currentY = currentY
    this._latestY += this.damping(diff)

    this.setContentY(this._latestY)

    if (Math.abs(this._latestY) < distance) {
      if (status !== DEACTIVATE) {
        this.setState({ status: DEACTIVATE })
      }
    }
    else {
      if (status === DEACTIVATE) {
        this.setState({ status: ACTIVATE })
      }
    }

    // https://github.com/ant-design/ant-design-mobile/issues/573#issuecomment-339560829
    // iOS UIWebView issue, It seems no problem in WKWebView
    if (IS_WEBVIEW && e.changedTouches[0].screenY < 0) {
      this.onTouchEnd()
    }
  }

  onTouchEnd(e) {
    const { direction } = this.attrs

    if (direction === NONE) {
      return
    }

    const { status } = this.state
    const currentY = e.changedTouches[0].clientY
    const startY = this._startY
    const directTo = startY < currentY ? DOWN : startY > currentY ? UP : NONE

    if (status === ACTIVATE) {
      this.setState({ status: RELEASE })

      const finish = () => {
        this.setState({ status: FINISH })
        this.reset()
      }

      if ([DOWN, BOTH].includes(direction) && directTo === DOWN) {
        this.onRefresh$.next()
        this.onRefresh$.subscribe(finish)
      }
      else if ([UP, BOTH].includes(direction) && directTo === UP) {
        this.onLoadMore$.next()
        this.onLoadMore$.subscribe(finish)
      }
    }
    else {
      this.reset()
    }
  }

  isEdge(directTo) {
    const { contentRef } = this
    if (directTo === UP) {
      return contentRef.scrollHeight - contentRef.scrollTop === contentRef.clientHeight
    }
    else if (directTo === DOWN) {
      return contentRef.scrollTop <= 0
    }
    else {
      return false
    }
  }

  damping(dy) {
    const { damping, distance } = this.attrs

    if (Math.abs(this._latestY) > distance * 2) {
      return 0
    }

    const ratio = Math.abs(this._currentY - this._startY) / window.innerHeight

    dy *= (1 - ratio) * damping

    return dy
  }

  reset() {
    this._latestY = 0
    this.setContentY(0)
  }

  setContentY(ty) {
    // todos: Why sometimes do not have `this.wrapperRef` ?
    const { wrapperRef } = this
    if (!wrapperRef) {
      return
    }
    wrapperRef.style.transition = `transform ${ty ? '0.1' : '0.5'}s`
    wrapperRef.style.transform = `translate3d(0px,${ty}px,0)`
  }

  render() {
    const { refreshIndicator, loadMoreIndicator, containerStyle = {}, contentStyle = {}, refreshIndicatorStyle = {}, loadMoreIndicatorStyle = {}, direction } = this.attrs
    const { status } = this.state
    const childrenComponent = <Static shouldUpdate={this.shouldUpdateChildren}>{() => this.children}</Static>

    return (
      <div ref={el => this.containerRef = el} style={{
        ...containerStyle,
        overflow: 'hidden',
      }}>
        <div ref={el => this.wrapperRef = el} style={{
          ...contentStyle,
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
          <If is={[DOWN, BOTH].includes(direction)}>
            <div style={{
              ...refreshIndicatorStyle,
              position: 'absolute',
              bottom: '100%',
              width: '100%',
              left: 0,
            }}>
              {refreshIndicator[status]}
            </div>
          </If>
          <div ref={el => this.contentRef = el} style={{
            width: '100%',
            height: '100%',
            overflowX: 'hidden',
          }}>
            {childrenComponent}
          </div>
          <If is={[UP, BOTH].includes(direction)}>
            <div style={{
              ...loadMoreIndicatorStyle,
              position: 'absolute',
              top: '100%',
              width: '100%',
              left: 0,
            }}>
              {loadMoreIndicator[status]}
            </div>
          </If>
        </div>
      </div>
    )
  }
}

export default MPullToLoad
