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
const ACTIVATE = 'activate'
const DEACTIVATE = 'deactivate'
const RELEASE = 'release'
const FINISH = 'finish'
const INDICATOR = {
  [ACTIVATE]: 'release',
  [DEACTIVATE]: 'pull',
  [RELEASE]: 'loading',
  [FINISH]: 'finish',
}

export class MPullToLoad extends Component {
  static props = {
    direction: enumerate([UP, DOWN, BOTH]),
    distance: Number,
    damping: range({ min: 0, max: Infinity }),
    indicator: {
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
    indicatorStyle: Object,
  }

  static defaultProps = {
    direction: BOTH,
    distance: 25,
    damping: 100,
    indicator: INDICATOR,
    refreshing: false,
    loading: false,

    onRefresh: noop,
    onLoadMore: noop,

    containerStyle: {},
    contentStyle: {},
    indicatorStyle: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      status: DEACTIVATE,
    }

    this.containerRef = null
    this.contentRef = null

    this._listeners = null
    this._currentY = 0
    this._startY = 0
    this._latestY = 0
    this._directTo = ''
    this._onEdge = false
    this._timer = null
    this._inited = false

    this.shouldUpdateChildren = false

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    this.shouldUpdateChildren = this.props.children !== nextProps.children
    return true
  }

  componentDidUpdate(prevProps) {
    const { props } = this
    if (prevProps.refreshing !== props.refreshing || prevProps.loading !== props.loading) {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.init()
        this._triggerImmediately()
      })
    }
  }

  componentDidMount() {
    clearTimeout(this._timer)
    this._timer = setTimeout(() => {
      this.init()
      this._triggerImmediately()
    })
  }

  componentWillUnmount() {
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

    this._listeners = {
      touchstart: this.onTouchStart,
      touchmove: this.onTouchMove,
      touchend: this.onTouchEnd,
      touchcancel: this.onTouchEnd,
    }

    Object.keys(this._listeners).forEach((key) => {
      containerRef.addEventListener(key, this._listeners[key], { passive: false })
    })

    this._inited = true
  }

  destroy() {
    if (!this._inited) {
      return
    }

    const { containerRef, _listeners } = this
    if (!_listeners || !containerRef) {
      // componentWillUnmount fire before componentDidMount, like forceUpdate ???!!
      return
    }

    Object.keys(_listeners).forEach(key => {
      containerRef.removeEventListener(key, _listeners[key])
    })
  }

  // trigger refresh immediately when monted
  _triggerImmediately() {
    if (!this._inited) {
      return
    }

    if (this._onEdge) {
      return
    }

    const { refreshing, loading, direction, distance } = this.attrs

    if (refreshing && [UP, BOTH].includes(direction)) {
      this._latestY = - distance - 1
      this.setState({ status: RELEASE }, () => {
        this.setContentY(this._latestY)
      })
      this.onRefresh$.next()
    }
    else if (loading && [DOWN, BOTH].includes(direction)) {
      this._latestY = distance + 1
      this.setState({ status: RELEASE }, () => {
        this.setContentY(this._latestY)
      })
      this.onLoadMore$.next()
    }
    else {
      this.setState({ status: FINISH }, () => {
        this.reset()
      })
    }
  }

  onTouchStart(e) {
    this._currentY = this._startY = e.touches[0].clientY
    // when refreshing is true, this._latestY has value
    this._latestY = this._latestY || 0
  }

  onTouchMove(e) {
    const { direction, distance } = this.attrs
    const currentY = e.touches[0].clientY
    const startY = this._startY
    const directTo = startY < currentY ? DOWN : startY > currentY ? UP : ''

    this._directTo = directTo

    console.log(currentY, startY, direction, directTo, this.isEdge())

    if (direction === UP && directTo !== UP) {
      return
    }
    if (direction === DOWN && directTo !== DOWN) {
      return
    }

    // if (!this.isEdge()) {
    //   return
    // }

    e.preventDefault()
    // add stopPropagation with fastclick will trigger content onClick event. why?
    // ref https://github.com/ant-design/ant-design-mobile/issues/2141
    // e.stopPropagation()

    const { _onEdge } = this
    const { status } = this.state

    if (!_onEdge) {
      this._currentY = this._startY = e.touches[0].clientY
      this._onEdge = true
    }


    console.log(this._currentY, currentY)

    const diff = Math.round(currentY - this._currentY)
    this._currentY = currentY
    this._latestY += this.damping(diff)

    console.log(this._latestY, diff, this._currentY)


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
    if (IS_WEBVIEW && e.changedTouches[0].clientY < 0) {
      this.onTouchEnd()
    }
  }

  onTouchEnd() {
    const { status } = this.state
    const { _directTo } = this
    const { direction } = this.attrs

    if (status === ACTIVATE) {
      this.setState({ status: RELEASE })

      const finish = () => {
        this.setState({ status: FINISH }, () => {
          this.reset()
        })
      }

      if ([UP, BOTH].includes(direction) && _directTo === UP) {
        this.onRefresh$.next()
        this.onRefresh$.subscribe(finish)
      }
      else if ([DOWN, BOTH].includes(direction) && _directTo === DOWN) {
        this.onLoadMore$.next()
        this.onLoadMore$.subscribe(finish)
      }
    }

    this._onEdge = false
    this._directTo = ''
  }

  isEdge() {
    const { _directTo, containerRef } = this
    if (_directTo === UP) {
      return containerRef.scrollHeight - containerRef.scrollTop === containerRef.clientHeight
    }
    if (_directTo === DOWN) {
      return containerRef.scrollTop <= 0
    }
    return false
  }

  damping(dy) {
    const { damping } = this.attrs
    if (Math.abs(this._latestY) > damping) {
      return 0
    }

    const ratio = Math.abs(this._currentY - this._startY) / window.innerHeight
    dy *= (1 - ratio) * 0.6

    return dy
  }

  reset() {
    this._latestY = 0
    this.setContentY(0)
  }

  setContentY(ty) {
    // todos: Why sometimes do not have `this.contentRef` ?
    const { contentRef } = this
    if (!contentRef) {
      return
    }
    contentRef.style.transform = `translate3d(0px,${ty}px,0)`
  }

  render() {
    const { indicator, containerStyle = {}, contentStyle = {}, indicatorStyle = {}, direction } = this.attrs
    const { status } = this.state
    const childrenComponent = <Static shouldUpdate={this.shouldUpdateChildren}>{() => this.children}</Static>

    return (
      <div ref={el => this.containerRef = el} style={containerStyle}>
        <div ref={el => this.contentRef = el} style={contentStyle}>
          <If is={[UP, BOTH].includes(direction)}>
            <div style={indicatorStyle}>
              {indicator[status]}
            </div>
          </If>
          {childrenComponent}
          <If is={[DOWN, BOTH].includes(direction)}>
            <div style={indicatorStyle}>
              {indicator[status]}
            </div>
          </If>
        </div>
      </div>
    )
  }
}

export default MPullToLoad
