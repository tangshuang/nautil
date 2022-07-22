// https://github.com/react-component/m-pull-to-refresh
// pull to refresh/load-more on mobile

import { isObject, isString } from 'ts-fns'

import { Static } from '../../lib/components/static.jsx'
import { If } from '../../lib/components/if-else.jsx'

import { ScrollSection } from '../../lib/elements/scroll-section.jsx'

const { DOWN, UP, BOTH, NONE, ACTIVATE, DEACTIVATE, RELEASE, FINISH } = ScrollSection

ScrollSection.implement(class {
  init() {
    if (this._inited) {
      return
    }

    this.state = {
      status: DEACTIVATE,
    }

    this.containerRef = null
    this.wrapperRef = null
    this.contentRef = null

    this._currentY = 0
    this._startY = 0
    this._latestY = 0

    this._latestTop = 0

    this._timer = null
    this._inited = false

    this.shouldUpdateChildren = false

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onScroll = this.onScroll.bind(this)

    const { containerRef, contentRef } = this
    if (!containerRef) {
      // like return in destroy fn ???!!
      return
    }

    containerRef.addEventListener('touchstart', this.onTouchStart, { passive: false })
    containerRef.addEventListener('touchmove', this.onTouchMove, { passive: false })
    containerRef.addEventListener('touchend', this.onTouchEnd, { passive: false })
    contentRef.addEventListener('scroll', this.onScroll, { passive: false })

    this._inited = true
  }

  shouldUpdate(nextProps) {
    this.shouldUpdateChildren = this.children !== nextProps.children
    return true
  }

  onMounted() {
    this._timer = setTimeout(() => {
      this.init()
      this.trigger()
    })
  }

  onUpdated(prevProps) {
    const { topLoading, bottomLoading } = this.attrs
    if (prevProps.topLoading && !topLoading) {
      this.setState({ status: FINISH })
      this.reset()
    }
    if (prevProps.bottomLoading && !bottomLoading) {
      this.setState({ status: FINISH })
      this.reset()
    }
  }

  onUnmount() {
    clearTimeout(this._timer)
    this.destroy()
  }

  destroy() {
    const { containerRef } = this
    if (!this._inited || !containerRef) {
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

    const { topLoading, bottomLoading, direction, distance } = this.attrs

    if (topLoading && [DOWN, BOTH].includes(direction)) {
      this.setState({ status: RELEASE })
      this._latestY = - distance - 1
      this.setContentY(this._latestY)
      this.dispatch('TopRelease')
    }
    else if (bottomLoading && [UP, BOTH].includes(direction)) {
      this.setState({ status: RELEASE })
      this._latestY = distance + 1
      this.setContentY(this._latestY)
      this.dispatch('BottomRelease')
    }
  }

  onTouchStart(e) {
    const { direction } = this.attrs
    const currentY = e.changedTouches[0].clientY
    this._currentY = currentY
    this._startY = currentY

    if (direction === NONE) {
      return
    }

    // when topLoading is true, this._latestY has value
    this._latestY = this._latestY || 0
  }

  // only affect when move to the edge, and to translateY to show hidden indicator
  onTouchMove(e) {
    const { direction, distance } = this.attrs
    const currentY = e.changedTouches[0].clientY
    const startY = this._startY
    const directTo = startY < currentY ? DOWN : startY > currentY ? UP : NONE

    if (direction === NONE) {
      return
    }
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
    if (typeof navigator !== 'undefined') {
      const IS_WEBVIEW = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
      if (IS_WEBVIEW && e.changedTouches[0].screenY < 0) {
        this.onTouchEnd()
      }
    }
  }

  onTouchEnd(e) {
    const { direction, bottomLoading, topLoading, distance } = this.attrs

    if (direction === NONE) {
      return
    }

    const { status } = this.state
    const currentY = e.changedTouches[0].clientY
    const startY = this._startY
    const directTo = startY < currentY ? DOWN : startY > currentY ? UP : NONE

    if (status === ACTIVATE) {
      this.setState({ status: RELEASE })

      if ([DOWN, BOTH].includes(direction) && directTo === DOWN) {
        this.dispatch('TopRelease')
        this.setContentY(distance)
      }
      else if ([UP, BOTH].includes(direction) && directTo === UP) {
        this.dispatch('BottomRelease')
        this.setContentY(-distance)
      }
    }
    else if (!bottomLoading && !topLoading) {
      this.reset()
    }
  }

  onScroll(e) {
    const { scrollTop } = e.target
    const directTo = scrollTop < this._latestTop ? UP : DOWN
    this._latestTop = scrollTop
    this.dispatch('Scroll', { scrollTop, directTo })
  }

  isEdge(directTo) {
    const { contentRef } = this
    if (directTo === UP) {
      return contentRef.scrollHeight - contentRef.scrollTop - 1 <= contentRef.offsetHeight
    }
    else if (directTo === DOWN) {
      return contentRef.scrollTop <= 0
    }
    else {
      return false
    }
  }

  damping(dy) {
    const { damping } = this.attrs
    const ratio = Math.abs(this._currentY - this._startY) / window.innerHeight

    dy *= (1 - ratio) * damping * 0.6

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
    const { topIndicator, bottomIndicator, containerStyle = {}, contentStyle = {}, topIndicatorStyle = {}, bottomIndicatorStyle = {}, direction } = this.attrs
    const { status } = this.state
    const childrenComponent = <Static shouldUpdate={this.shouldUpdateChildren}>{() => this.children}</Static>

    return (
      <div
        ref={el => this.containerRef = el}
        className={[this.className, isString(containerStyle) ? containerStyle : undefined]}
        style={{
          overflow: 'hidden',
          ...this.style,
          ...(isObject(containerStyle) ? containerStyle : {}),
        }}
      >
        <div
          ref={el => this.wrapperRef = el}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <If is={[DOWN, BOTH].includes(direction)}>
            <div
              className={isString(topIndicatorStyle) ? topIndicatorStyle : undefined}
              style={{
                position: 'absolute',
                left: 0,
                bottom: '100%',
                zIndex: 0,
                ...(isObject(topIndicatorStyle) ? topIndicatorStyle : {}),
              }}
            >
              {topIndicator[status]}
            </div>
          </If>
          <div
            ref={el => this.contentRef = el}
            className={[isString(contentStyle) ? contentStyle : undefined]}
            style={{
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              position: 'relative',
              zIndex: 1,
              ...(isObject(contentStyle) ? contentStyle : {}),
            }}
          >
            {childrenComponent}
          </div>
          <If is={[UP, BOTH].includes(direction)}>
            <div
              className={isString(bottomIndicatorStyle) ? bottomIndicatorStyle : undefined}
              style={{
                position: 'absolute',
                left: 0,
                top: '100%',
                zIndex: 0,
                ...(isObject(bottomIndicatorStyle) ? bottomIndicatorStyle : {}),
              }}
            >
              {bottomIndicator[status]}
            </div>
          </If>
        </div>
      </div>
    )
  }
})

export { ScrollSection }
export default ScrollSection
